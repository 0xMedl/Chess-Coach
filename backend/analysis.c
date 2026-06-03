#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "analysis.h"
#include "stockfish.h"
#include "board.h"

static void	parse_eval(const char *info, int *cp, char *eval_str,
			int *is_mate, int *mate_in)
{
	const char	*p;
	int	val;

	*cp = 0;
	*is_mate = 0;
	*mate_in = 0;
	eval_str[0] = '\0';
	if (!info || info[0] == '\0')
	{
		snprintf(eval_str, 16, "0.00");
		return ;
	}
	p = strstr(info, "score mate ");
	if (p)
	{
		*is_mate = 1;
		sscanf(p + 11, "%d", mate_in);
		snprintf(eval_str, 16, "M%d", *mate_in);
		return ;
	}
	p = strstr(info, "score cp ");
	if (p)
	{
		sscanf(p + 9, "%d", &val);
		*cp = val;
		if (val > 0)
			snprintf(eval_str, 16, "+%.2f", val / 100.0);
		else
			snprintf(eval_str, 16, "%.2f", val / 100.0);
	}
	else
		snprintf(eval_str, 16, "0.00");
}

t_analysis	analyze_position(const char *fen, int elo, int movetime_ms)
{
	t_analysis	a;
	char		cmd[1024];
	char		*result;
	char		new_fen[512];

	memset(&a, 0, sizeof(t_analysis));
	snprintf(cmd, sizeof(cmd),
		"setoption name UCI_LimitStrength value true\n");
	sf_send(cmd);
	snprintf(cmd, sizeof(cmd),
		"setoption name UCI_Elo value %d\n", elo);
	sf_send(cmd);
	snprintf(cmd, sizeof(cmd), "position fen %s\n", fen);
	sf_send(cmd);
	snprintf(cmd, sizeof(cmd), "go movetime %d\n", movetime_ms);
	sf_send(cmd);
	result = sf_wait_for("bestmove");
	sscanf(result, "bestmove %7s", a.best_move);
	parse_eval(sf_read_last_info(), &a.eval_cp, a.eval_str,
		&a.is_mate, &a.mate_in);
	apply_move(fen, a.best_move, new_fen, sizeof(new_fen));
	snprintf(cmd, sizeof(cmd), "position fen %s\n", new_fen);
	sf_send(cmd);
	snprintf(cmd, sizeof(cmd), "go movetime %d\n", movetime_ms / 2);
	sf_send(cmd);
	result = sf_wait_for("bestmove");
	sscanf(result, "bestmove %7s", a.threat_move);
	return (a);
}
