import React, { Fragment, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { InputAdornment } from '@mui/material/';
import SearchIcon from '@mui/icons-material/Search';
import skipValue from '../util/skip';
import { CircularProgress } from '@mui/material';

function AutoComplete() {
	const [busStop, setBusStop] = useState([]);
	const [value, setValue] = useState({
		BusStopCode: '',
		Description: ''
	});
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const [error, setError] = useState('');
	const handleSubmit = async () => {
		if (!value) return;
		const { data } = await axios.post(
			'https://asia-southeast1-bus-web-e67df.cloudfunctions.net/api/getBusArrival',
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
			const duplicate = BusStop.some((element) => {
				if (element.BusStopCode === value.BusStopCode) {
					return true;
				}
				return false;
			});
			if (duplicate) return;
			localStorage.setItem('BusStop', JSON.stringify([...BusStop, value]));
			window.location.reload();
		} else {
			localStorage.setItem('BusStop', JSON.stringify([value]));
			window.location.reload();
		}
	};

	const handleBusStop = async (value) => {
		setValue((prevState) => ({
			...prevState,
			BusStopCode: value
		}));
		if (value.toString().length === 3) {
			setOpen(true);
			setLoading(true);
			let skip = skipValue(value);
			const { data } = await axios.post(
				'https://asia-southeast1-bus-web-e67df.cloudfunctions.net/api/getBusStop',
				{
					data: { skip: skip }
				}
			);
			setBusStop(data.value);
			setLoading(false);
		} else return;
	};

	return (
		<Autocomplete
			open={open}
			loading={loading}
			onChange={(event, newValue) => {
				setOpen(false);
				setValue((prevState) => ({
					...prevState,
					BusStopCode: newValue?.BusStopCode,
					Description: newValue?.Description
				}));
			}}
			freeSolo
			size="large"
			forcePopupIcon={false}
			id="bus-stop-select"
			options={busStop}
			getOptionLabel={(option) =>
				option.BusStopCode ? option.BusStopCode : ''
			}
			autoHighlight
			renderOption={(props, option) => (
				<Box
					component="li"
					{...props}
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}>
					{loading ? (
						<CircularProgress />
					) : (
						<Fragment>
							<Typography sx={{ mr: 2 }} variant="body1">
								({option.BusStopCode})
							</Typography>
							<Typography sx={{ ml: 2 }} variant="body1">
								{option.Description}
							</Typography>
						</Fragment>
					)}
				</Box>
			)}
			renderInput={(params) => (
				<TextField
					error={error ? true : false}
					helperText={error ? error : ''}
					onChange={(e) => handleBusStop(e.target.value)}
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
