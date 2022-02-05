import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

function BusInfo({ code, description }) {
	const [loading, setLoading] = useState(false);
	const [busArrival, setBusArrival] = useState([]);
	const [pause, setPause] = useState(false);

	const firstFetch = async () => {
		setLoading(true);
		const { data } = await axios.post(
			'http://localhost:5001/bus-web-e67df/asia-southeast1/api/getBusArrival',
			{
				data: {
					busStopCode: code
				}
			}
		);
		setBusArrival(data.Services);
		setLoading(false);
	};

	useEffect(() => {
		firstFetch();
		if (pause) {
			const interval = setInterval(async () => {
				setLoading(true);
				const { data } = await axios.post(
					'http://localhost:5001/bus-web-e67df/asia-southeast1/api/getBusArrival',
					{
						data: {
							busStopCode: code
						}
					}
				);
				setBusArrival(data.Services);
				setLoading(false);
			}, 10000);
			return () => clearInterval(interval);
		}
	}, [pause]);

	console.log(busArrival);

	return (
		<div>
			<Accordion
				sx={{ borderBottom: 1, borderColor: 'grey.500' }}
				onChange={(event, expanded) => {
					setPause(expanded);
				}}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header">
					<Typography>{description}</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ display: 'flex', justifyContent: 'center' }}>
					{loading ? (
						<CircularProgress />
					) : (
						<Typography>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
							fugit fuga asperiores blanditiis eos placeat omnis minus, ullam
							laudantium quae aut sint ab adipisci enim sapiente cupiditate
							repellendus! Nesciunt, quibusdam?
						</Typography>
					)}
				</AccordionDetails>
				<Divider />
			</Accordion>
		</div>
	);
}

export default BusInfo;
