#include <stdio.h>
#include <string.h>
#include "board.h"

int	apply_move(const char *fen, const char *move, char *new_fen, int buf_size)
{
	if (!fen || !move || !new_fen)
		return (0);
	snprintf(new_fen, buf_size, "%s moves %s", fen, move);
	return (1);
}
