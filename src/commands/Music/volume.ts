import { requireMusicPlaying, requireSameVoiceChannel, requireSkyraInVoiceChannel, requireUserInVoiceChannel } from '#lib/audio';
import { LanguageKeys } from '#lib/i18n/languageKeys';
import { MusicCommand } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { Events } from '#lib/types/Enums';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<MusicCommand.Options>({
	aliases: ['vol'],
	description: LanguageKeys.Commands.Music.VolumeDescription,
	extendedHelp: LanguageKeys.Commands.Music.VolumeExtended
})
export class UserMusicCommand extends MusicCommand {
	@requireUserInVoiceChannel()
	@requireSkyraInVoiceChannel()
	@requireSameVoiceChannel()
	@requireMusicPlaying()
	public async run(message: GuildMessage, args: MusicCommand.Args) {
		const { audio } = message.guild;
		const newVolume = args.finished ? null : await args.pick('integer', { minimum: 0, maximum: 300 });
		const previousVolume = await audio.getVolume();

		// If no argument was given
		if (newVolume === null || newVolume === previousVolume) {
			return message.channel.send(args.t(LanguageKeys.Commands.Music.VolumeSuccess, { volume: previousVolume }));
		}

		const channel = audio.voiceChannel!;
		if (channel.listeners.length >= 4 && !(await message.member.canManage(channel))) {
			this.error(LanguageKeys.Preconditions.MusicDjMember);
		}

		// Set the volume
		await audio.setVolume(newVolume);
		return this.context.client.emit(Events.MusicSongVolumeUpdateNotify, message, previousVolume, newVolume);
	}
}
