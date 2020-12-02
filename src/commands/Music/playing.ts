import { MusicCommand } from '#lib/structures/MusicCommand';
import { GuildMessage } from '#lib/types/Discord';
import { LanguageKeys } from '#lib/types/namespaces/LanguageKeys';
import { requireMusicPlaying } from '#utils/Music/Decorators';
import { IMAGE_EXTENSION, showSeconds } from '#utils/util';
import { TrackInfo } from '@skyra/audio';
import { ApplyOptions } from '@skyra/decorators';
import { MessageEmbed } from 'discord.js';

@ApplyOptions<MusicCommand.Options>({
	aliases: ['np', 'nowplaying'],
	description: (language) => language.get(LanguageKeys.Commands.Music.PlayingDescription),
	requiredPermissions: ['EMBED_LINKS']
})
export default class extends MusicCommand {
	private readonly kYoutubeUrlRegex = /(youtu\.be|youtube)/i;

	@requireMusicPlaying()
	public async run(message: GuildMessage) {
		const { audio } = message.guild;

		const entry = await audio.getCurrentTrack();
		if (!entry) throw await message.fetchLocale(LanguageKeys.Commands.Music.PlayingQueueEmpty);

		const track = await audio.player.node.decode(entry.track);
		const embed = await this.getMessageEmbed(message, track);
		return message.send(embed);
	}

	private async getMessageEmbed(message: GuildMessage, track: TrackInfo): Promise<MessageEmbed> {
		const embed = new MessageEmbed()
			.setColor(12916736)
			.setTitle(track.title)
			.setURL(track.uri)
			.setAuthor(track.author)
			.setDescription(await message.fetchLocale(LanguageKeys.Commands.Music.PlayingDuration, { duration: showSeconds(track.length) }))
			.setTimestamp();

		const imageUrl = this.getSongImage(track.uri, track.identifier);
		if (imageUrl && IMAGE_EXTENSION.test(imageUrl)) embed.setThumbnail(imageUrl);

		return embed;
	}

	private getSongImage(songUrl: string, songIdentifier: string) {
		if (this.kYoutubeUrlRegex.test(songUrl)) {
			return `https://i3.ytimg.com/vi/${songIdentifier}/hqdefault.jpg`;
		}

		return null;
	}
}
