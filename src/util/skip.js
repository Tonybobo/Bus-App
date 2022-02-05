export default function skipValue(value) {
	let skip = 0;
	let num = value;
	if (num === 0 || num < 140) {
		skip = 0;
	} else if (num >= 140 && num < 221) {
		skip = 500;
	} else if (num >= 221 && num < 280) {
		skip = 1000;
	} else if (num >= 280 && num < 438) {
		skip = 1500;
	} else if (num >= 438 && num < 476) {
		skip = 2000;
	} else if (num >= 476 && num < 560) {
		skip = 2500;
	} else if (num >= 560 && num < 640) {
		skip = 3000;
	} else if (num >= 640 && num < 701) {
		skip = 3500;
	} else if (num >= 701 && num < 821) {
		skip = 4000;
	} else if (num >= 821 && num < 980) {
		skip = 4500;
	} else if (num >= 980) {
		skip = 5000;
	}
	return skip;
}
