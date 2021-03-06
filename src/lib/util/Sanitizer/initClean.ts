import {
	CLIENT_OPTIONS,
	CLIENT_SECRET,
	INFLUX_OPTIONS,
	LAVALINK_PASSWORD,
	PGSQL_DATABASE_OPTIONS,
	PGSQL_DATABASE_PASSWORD,
	REDIS_OPTIONS,
	TOKENS,
	WEBHOOK_ERROR
} from '#root/config';
import { initClean } from '#utils/Sanitizer/clean';

const raw = Object.values(TOKENS)
	.concat([
		CLIENT_SECRET,
		LAVALINK_PASSWORD,
		PGSQL_DATABASE_PASSWORD,
		WEBHOOK_ERROR.token!,
		INFLUX_OPTIONS.token!,
		REDIS_OPTIONS.password,
		PGSQL_DATABASE_OPTIONS.user,
		PGSQL_DATABASE_OPTIONS.database,
		// @ts-expect-error REDIS_OPTIONS is passed into audio
		CLIENT_OPTIONS.audio.redis.password
	])
	.filter((value) => typeof value === 'string' && value !== '');

initClean([...new Set(raw)]);
