import Message from '@/message';
import Module from '@/module';
import autobind from 'autobind-decorator';
import fetch from 'node-fetch';
import { z } from 'zod';

export default class extends Module {
	public readonly name = 'kiatsu';

	private readonly itemSchema = z.object({
		time: z.enum(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']),
		weather: z.string(),
		temp: z.string(),
		pressure: z.string(),
		pressure_level: z.enum(['0', '1', '2', '3', '4'])
	});

	private readonly schema = z.object({
		place_name: z.literal('東京都中央区'),
		place_id: z.literal('102'),
		prefectures_id: z.literal('13'),
		dateTime: z.string(),
		yesterday: z.array(this.itemSchema).optional(),
		today: z.array(this.itemSchema),
		tomorrow: z.array(this.itemSchema).optional(),
		dayaftertomorrow: z.array(this.itemSchema).optional()
	});

	private currentPressure: z.infer<typeof this.itemSchema>['pressure'] = '';

	private currentPressureLevel: z.infer<typeof this.itemSchema>['pressure_level'] = '0';

	private readonly stringPressureLevel: { [K in typeof this.currentPressureLevel]: (hPa: string) => string } = {
		0: (hPa) => `${hPa}hPaだから問題ないかも。無理しないでね。`,
		1: (hPa) => `${hPa}hPaだから問題ないかも。無理しないでね。`,
		2: (hPa) => `気圧${hPa}hPaでちょっとやばいかも。無理しないでね。`,
		3: (hPa) => `気圧${hPa}hPaでやばいかも。無理しないでね。`,
		4: (hPa) => `気圧${hPa}hPaでかなりやばいかも。無理しないでね。`
	} as const;

	@autobind
	public install() {
		setInterval(this.update, 10 * 60 * 1000);
		setInterval(this.post, 12 * 60 * 60 * 1000);

		this.update();

		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async update() {
		try {
			const response = await fetch('https://zutool.jp/api/getweatherstatus/13102');
			const data = await response.json();

			const result = this.schema.safeParse(data);

			if (!result.success) {
				this.log('Validation failed.');
				console.warn(result.error);

				return;
			}

			const date = new Date();
			const hour = this.itemSchema.shape.time.parse(date.getHours().toString());

			this.currentPressureLevel = result.data.today[hour].pressure_level;
			this.currentPressure = result.data.today[hour].pressure;
		} catch (error) {
			this.log('Failed to fetch status.');
			console.warn(error);
		}
	}

	@autobind
	private post() {
		if (this.currentPressureLevel === '0' || this.currentPressureLevel === '1') return;

		this.ai.post({
			text: this.stringPressureLevel[this.currentPressureLevel](this.currentPressure)
		});
	}

	@autobind
	private async mentionHook(message: Message) {
		if (!message.includes(['気圧', 'きあつ'])) return false;

		message.reply(this.stringPressureLevel[this.currentPressureLevel](this.currentPressure), { immediate: true });

		return true;
	}
}
