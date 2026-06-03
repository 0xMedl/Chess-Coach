#ifndef STOCKFISH_H
#define STOCKFISH_H

void	sf_launch(const char *path);
void	sf_send(const char *cmd);
char	*sf_wait_for(const char *target);
char	*sf_read_last_info(void);
void	sf_quit(void);

#endif
