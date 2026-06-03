#include <stdio.h>
#include <string.h>
#include "coach.h"

char	*generate_advice(t_analysis *a, int is_white, int move_number)
{
	static char	advice[512];
	int		eval;

	eval = is_white ? a->eval_cp : -(a->eval_cp);
	if (a->is_mate && a->mate_in > 0 && a->mate_in <= 2)
		snprintf(advice, sizeof(advice),
			"CHECKMATE IN %d — execute the forced win.", a->mate_in);
	else if (a->is_mate && a->mate_in < 0)
		snprintf(advice, sizeof(advice),
			"DANGER: opponent has mate in %d. Find a defense now.",
			-(a->mate_in));
	else if (eval > 300)
		snprintf(advice, sizeof(advice),
			"Winning (+%.2f). Simplify — trade pieces, march your pawns.",
			eval / 100.0);
	else if (eval > 100)
		snprintf(advice, sizeof(advice),
			"Solid advantage (+%.2f). Improve your worst piece.",
			eval / 100.0);
	else if (eval >= -100)
	{
		if (move_number < 10)
			snprintf(advice, sizeof(advice),
				"Equal. Develop pieces, control center, castle before move 10.");
		else
			snprintf(advice, sizeof(advice),
				"Balanced (%.2f). Find a pawn break or improve piece activity.",
				eval / 100.0);
	}
	else if (eval >= -300)
		snprintf(advice, sizeof(advice),
			"Under pressure (%.2f). Seek counterplay — avoid passive moves.",
			eval / 100.0);
	else
		snprintf(advice, sizeof(advice),
			"Serious trouble (%.2f). Look for a tactical shot or sacrifice.",
			eval / 100.0);
	return (advice);
}
