import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import CancelIcon from '@mui/icons-material/Cancel';

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary
}));

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
			}, 60000);
			return () => clearInterval(interval);
		}
	}, [pause]);

	const removeBusStop = () => {
		let BusStop = JSON.parse(localStorage.getItem('BusStop'));
		let filteredBusStop = BusStop.filter((el) => el.BusStopCode !== code);
		localStorage.setItem('BusStop', JSON.stringify(filteredBusStop));
		window.location.reload();
	};

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
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							width: '100%'
						}}>
						<Typography>{description}</Typography>
						<CancelIcon onClick={removeBusStop} />
					</Box>
				</AccordionSummary>
				<AccordionDetails sx={{ display: 'flex', justifyContent: 'center' }}>
					{loading ? (
						<CircularProgress />
					) : (
						<Box sx={{ flexGrow: 1 }}>
							{busArrival.map((busService) => {
								return (
									<Grid
										container
										style={{ marginBottom: '1em' }}
										key={busService.ServiceNo}
										spacing={2}>
										<Grid item xs={2} p={0} m={1}>
											<Item
												style={{
													borderRight: '1px solid grey'
												}}>
												<Typography variant="body1" component="body1">
													{busService.ServiceNo}
												</Typography>
											</Item>
										</Grid>
										<Grid item xs={3}>
											<Item
												style={{
													borderRight: '1px solid grey',
													borderLeft: '1px solid grey'
												}}>
												{busService.NextBus.EstimatedArrival.trim() === ''
													? 'NA'
													: moment(Date.now()).from(
															busService.NextBus.EstimatedArrival,
															true
													  )}
											</Item>
										</Grid>
										<Grid item xs={3}>
											<Item
												style={{
													borderRight: '1px solid grey',
													borderLeft: '1px solid grey'
												}}>
												{busService.NextBus2.EstimatedArrival.trim() === ''
													? 'NA'
													: moment(Date.now()).from(
															busService.NextBus2.EstimatedArrival,
															true
													  )}
											</Item>
										</Grid>
										<Grid item xs={3}>
											<Item
												style={{
													borderRight: '1px solid grey',
													borderLeft: '1px solid grey'
												}}>
												{busService.NextBus3.EstimatedArrival.trim() === ''
													? 'NA'
													: moment(Date.now()).from(
															busService.NextBus3.EstimatedArrival,
															true
													  )}
											</Item>
										</Grid>
									</Grid>
								);
							})}
						</Box>
					)}
				</AccordionDetails>
				<Divider />
			</Accordion>
		</div>
	);
}

export default BusInfo;
