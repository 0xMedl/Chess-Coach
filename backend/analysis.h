#ifndef ANALYSIS_H
#define ANALYSIS_H

typedef struct s_analysis
{
	char	best_move[8];
	char	threat_move[8];
	int	eval_cp;
	char	eval_str[16];
	int	is_mate;
	int	mate_in;
}	t_analysis;

t_analysis	analyze_position(const char *fen, int elo, int movetime_ms);

#endif
