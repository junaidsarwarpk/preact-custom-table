import { h, Component } from 'preact';
import CustomTable from './custom-table/custom-table';

const App = () => {
	const users = [
		{
			id: 1,
			name: 'Junaid Sarwar'
		},
		{
			id: 2,
			name: 'Abdul Basit'
		},
		{
			id: 3,
			name: 'Usama Saeed'
		},
		{
			id: 4,
			name: 'Abuzer Asif'
		}
	];

	const formatActions = (_h, _c) => "Custom Action";

	return (
		<div id="app">
			<CustomTable
	head={['id', 'name AS User Name', 'actions']}
				collection={users}
				search
				searchOn={['name']}
				customTemplates={{ actions: formatActions }}
			/>
		</div>
	);
};
export default App;
