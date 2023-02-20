import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';

type TParseFormDataJsonOptions = {
	props: string[];
};

@Injectable()
export class ParseFormDataJsonPipe implements PipeTransform {
	constructor(private readonly options: TParseFormDataJsonOptions) {}

	transform(value: any, metadata: ArgumentMetadata) {
		if (metadata.type != 'body') {
			return value;
		}

		try {
			const deserializedValue: {
				[key: string]: any;
			} = {};

			for (const prop of this.options.props) {
				deserializedValue[prop] = JSON.parse(value[prop]);
			}

			return { ...value, ...deserializedValue };
		} catch (e) {
			if (e instanceof Error) {
				throw new BadRequestException(e.message);
			}
		}
	}
}
