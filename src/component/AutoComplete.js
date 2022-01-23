import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { InputAdornment } from '@mui/material/';
import SearchIcon from '@mui/icons-material/Search';

function AutoComplete() {
	const [busStop, setBusStop] = useState([]);
	const [value, setValue] = useState({
		BusStopCode: '',
		Description: ''
	});
	const [error, setError] = useState('');
	const handleSubmit = async () => {
		if (!value) return;
		const { data } = await axios.post(
			'http://localhost:5001/bus-web-e67df/asia-southeast1/api/getBusArrival',
			{
				data: {
					busStopCode: value.BusStopCode
				}
			}
		);

		console.log(data);
		if (data.BusStopCode === 'undefined') {
			setError('No Bus Stop Found');
			return;
		}
		setError('');
		let BusStop = localStorage.getItem('BusStop');
		if (BusStop) {
			BusStop = JSON.parse(BusStop);
			localStorage.setItem('BusStop', JSON.stringify([...BusStop, value]));
		} else {
			localStorage.setItem('BusStop', JSON.stringify([value]));
		}
	};
	useEffect(() => {
		async function fetchBusStop() {
			const { data } = await axios.get(
				'http://localhost:5001/bus-web-e67df/asia-southeast1/api/getBusStop'
			);
			setBusStop(data.value);
		}
		fetchBusStop();
	}, []);

	return (
		<Autocomplete
			freeSolo
			size="large"
			onChange={(event, value) => setValue(value)}
			forcePopupIcon={false}
			id="bus-stop-select"
			options={busStop}
			getOptionLabel={(option) =>
				option.BusStopCode ? option.BusStopCode : ''
			}
			autoHighlight
			renderOption={(props, option) => (
				<Box component="li" {...props} sx={{ display: 'flex' }}>
					<Typography sx={{ mr: 2 }} variant="body1">
						({option.BusStopCode})
					</Typography>
					<Typography sx={{ ml: 2 }} variant="body1">
						{option.Description}
					</Typography>
				</Box>
			)}
			renderInput={(params) => (
				<TextField
					error={error}
					helperText={error ? error : ''}
					onChange={(e) => setValue(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							handleSubmit();
						}
					}}
					sx={{ mb: 2 }}
					fullWidth
					{...params}
					label="Enter Bus Stop Code"
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<InputAdornment position="end">
								<SearchIcon fontSize="large" onClick={handleSubmit} />
							</InputAdornment>
						)
					}}
				/>
			)}
		/>
	);
}

export default AutoComplete;
