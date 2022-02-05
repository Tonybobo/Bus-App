import './App.css';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import BusAlertIcon from '@mui/icons-material/BusAlert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BusInfo from './component/BusInfo';
import { useEffect, useState } from 'react';
import AutoComplete from './component/AutoComplete';

const darkTheme = createTheme({
	palette: {
		mode: 'dark'
	}
});

function App() {
	const [busStop, setBusStop] = useState([]);
	useEffect(() => {
		const local = JSON.parse(localStorage.getItem('BusStop'));
		setBusStop(local);
	}, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<BusAlertIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Bus Cloud
					</Typography>
					<Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
						<AutoComplete />
					</Box>
				</Box>
				<Box
					sx={{
						width: '100%',
						height: 'auto',
						borderColor: 'grey.900',
						border: 0.5,
						borderRadius: 1
					}}>
					{busStop?.map((busStop) => {
						return (
							<BusInfo
								description={busStop.Description}
								code={busStop.BusStopCode}
								key={busStop.BusStopCode}
							/>
						);
					})}
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export default App;
