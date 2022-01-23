import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

function BusInfo({ code, description }) {
	const [loading, setLoading] = useState(false);
	const [busArrival, setBusArrival] = useState([]);
	const handleSubmit = async () => {
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

	return (
		<div>
			<Accordion
				sx={{ borderBottom: 1, borderColor: 'grey.500' }}
				onClick={handleSubmit}>
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
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
							eget.
						</Typography>
					)}
				</AccordionDetails>
				<Divider />
			</Accordion>
		</div>
	);
}

export default BusInfo;
