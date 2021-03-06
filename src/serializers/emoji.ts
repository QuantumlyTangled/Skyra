import { Serializer, SerializerUpdateContext } from '#lib/database';
import { LanguageKeys } from '#lib/i18n/languageKeys';
import { resolveEmoji } from '#utils/util';
import type { Awaited } from '@sapphire/utilities';

export class UserSerializer extends Serializer<string> {
	public async parse(args: Serializer.Args) {
		return this.result(args, await args.pickResult('emoji'));
	}

	public isValid(value: string, { t, entry }: SerializerUpdateContext): Awaited<boolean> {
		const resolved = resolveEmoji(value);
		if (resolved === null || value !== resolved) {
			throw new Error(t(LanguageKeys.Serializers.InvalidEmoji, { name: entry.name }));
		}

		return true;
	}

	public stringify(data: string) {
		return data.startsWith('%') ? decodeURIComponent(data) : `<${data}>`;
	}
}
