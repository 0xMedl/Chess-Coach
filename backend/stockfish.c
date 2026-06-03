#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include "stockfish.h"

#define BUF 8192

static int	sf_in[2];
static int	sf_out[2];
static pid_t	sf_pid;
static char	last_info[BUF];

void	sf_launch(const char *path)
{
	pipe(sf_in);
	pipe(sf_out);
	sf_pid = fork();
	if (sf_pid == 0)
	{
		dup2(sf_in[0], STDIN_FILENO);
		dup2(sf_out[1], STDOUT_FILENO);
		close(sf_in[1]);
		close(sf_out[0]);
		execlp(path, path, NULL);
		exit(1);
	}
	close(sf_in[0]);
	close(sf_out[1]);
	sf_send("uci\n");
	sf_wait_for("uciok");
	sf_send("isready\n");
	sf_wait_for("readyok");
}

void	sf_send(const char *cmd)
{
	write(sf_in[1], cmd, strlen(cmd));
}

char	*sf_wait_for(const char *target)
{
	static char	buf[BUF];
	char		line[1024];
	int		pos;
	char		c;

	pos = 0;
	while (1)
	{
		read(sf_out[0], &c, 1);
		if (c == '\n')
		{
			line[pos] = '\0';
			pos = 0;
			if (strstr(line, "info"))
				strncpy(last_info, line, BUF - 1);
			if (strstr(line, target))
			{
				strncpy(buf, line, BUF - 1);
				return (buf);
			}
		}
		else
			line[pos++] = c;
	}
}

char	*sf_read_last_info(void)
{
	return (last_info);
}

void	sf_quit(void)
{
	sf_send("quit\n");
}
