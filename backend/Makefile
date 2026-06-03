NAME	= chess-coach-backend

CC	= gcc
CFLAGS	= -Wall -Wextra -Werror
LIBS	= -lwebsockets -ljson-c

SRCS	= main.c stockfish.c board.c analysis.c coach.c
OBJS	= $(SRCS:.c=.o)

all: $(NAME)

$(NAME): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o $(NAME) $(LIBS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
