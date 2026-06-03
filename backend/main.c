#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <libwebsockets.h>
#include <json-c/json.h>
#include "stockfish.h"
#include "analysis.h"
#include "coach.h"

#define PORT 8080
#define ELO  2300

static int	callback_chess(struct lws *wsi,
			enum lws_callback_reasons reason,
			void *user, void *in, size_t len)
{
	char			*msg;
	struct json_object	*req;
	struct json_object	*obj;
	const char		*fen;
	t_analysis		a;
	char			*advice;
	char			response[2048];
	unsigned char		buf[LWS_PRE + 2048];
	int			is_white;
	int			move_number;

	(void)user;
	if (reason != LWS_CALLBACK_RECEIVE)
		return (0);
	msg = strndup((char *)in, len);
	req = json_tokener_parse(msg);
	free(msg);
	if (!req)
		return (0);
	fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	is_white = 1;
	move_number = 1;
	if (json_object_object_get_ex(req, "fen", &obj))
		fen = json_object_get_string(obj);
	if (json_object_object_get_ex(req, "is_white", &obj))
		is_white = json_object_get_int(obj);
	if (json_object_object_get_ex(req, "move_number", &obj))
		move_number = json_object_get_int(obj);
	a = analyze_position(fen, ELO, 800);
	advice = generate_advice(&a, is_white, move_number);
	snprintf(response, sizeof(response),
		"{"
		"\"type\":\"analysis\","
		"\"best_move\":\"%s\","
		"\"threat_move\":\"%s\","
		"\"eval_cp\":%d,"
		"\"eval_str\":\"%s\","
		"\"is_mate\":%d,"
		"\"mate_in\":%d,"
		"\"coach_text\":\"%s\""
		"}",
		a.best_move, a.threat_move, a.eval_cp,
		a.eval_str, a.is_mate, a.mate_in, advice);
	json_object_put(req);
	memset(buf, 0, sizeof(buf));
	memcpy(&buf[LWS_PRE], response, strlen(response));
	lws_write(wsi, &buf[LWS_PRE], strlen(response), LWS_WRITE_TEXT);
	return (0);
}

static struct lws_protocols	protocols[] = {
	{"chess-coach", callback_chess, 0, 4096},
	{NULL, NULL, 0, 0}
};

int	main(void)
{
	struct lws_context_creation_info	info;
	struct lws_context			*context;

	sf_launch("stockfish");
	printf("Stockfish ready. Starting server on port %d...\n", PORT);
	memset(&info, 0, sizeof(info));
	info.port = PORT;
	info.protocols = protocols;
	context = lws_create_context(&info);
	if (!context)
	{
		fprintf(stderr, "Failed to create WebSocket context\n");
		return (1);
	}
	printf("Chess Coach backend running.\n");
	while (1)
		lws_service(context, 50);
	lws_context_destroy(context);
	sf_quit();
	return (0);
}
