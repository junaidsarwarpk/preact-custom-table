import { Component } from 'preact';
import styles from './custom-table.css';

/**
 * @author  Junaid Sarwar <junaid.sarwar@usepace.com, junaidsarwar001@gmail.com>
 * @overview    A Component to render table for selected columns offering custom template for any column(s)
 * @param { Object } customClass      Custom class you want to specify with table
 * @param { string[] } head        Array of columns which should be rendered
 * @param { Object[] } collection      Collection where it shoult look for head columns
 * @param { Object } customTemplates        A Key-value pair of the colums and functions you want custom template for
 */
class CustomTable extends Component {
	state = {
		collection: [],
		searchVal: ''
	}
	formatCell(item, col) {

		if (col && col.indexOf(' AS ') > -1) col = col.split(' AS ')[0];

		if (
			!this.props.customTemplates ||
			Object.keys(this.props.customTemplates).indexOf(col) < 0
		) {
			if (col.indexOf('.') === -1) { return item[col]; }

			let tempObj = item;

			for (let k of col.split('.')) {
				tempObj = tempObj[k];
			}

			return tempObj;


		}
		if (
			Object.getPrototypeOf(this.props.customTemplates[col]) !== Function.prototype
		) {
			throw new Error(
				`Function expected as custom template ${typeof this.props.customTemplates[
					col
				]} found`
			);
		}
		return this.props.customTemplates[col](item, col);
	}


	formatHead(_prop) {
		return _prop
			.toString()
			.split(' AS ')[1] || _prop
			.toString().split(' AS ')[0]
			.toString()
			.split('.')
			.join('_')
			.split('_')
			.map(i => i.toString().capitalize())
			.join(' ');
	}
	onSearch = (e, _collection) => {
		let val = e ? e.target.value : this.state.searchVal;
		if (this.props.customSearch) {
			if (e.keyCode === 13) {
				this.props.onCustomSearch(val);
			}

			return;
		}

		let collection = _collection ? _collection : this.props.collection;

		collection = val ? collection.map(c => {
			let isValidField = !!0;
			this.props.searchOn.forEach(_f => {

				if (_f.indexOf('.') > -1) {
					let _col = c;
					for (let k of _f.split('.')) {
						_col = _col[k];
					}

					if (_col && _col.toString().toLowerCase().includes(val.toString().toLowerCase())) isValidField = true;

				}

				else if (c[_f] && c[_f].toString().toLowerCase().includes(val.toString().toLowerCase())) isValidField = true;
			});
			return { ...c, isValidField };
		}) : collection;

		let obj = {
			collection
		};
		e && (obj.searchVal = e.target.value);
		this.setState(obj);

	}

	getFooter = () => {
		if (this.props.paginated && this.props.paginationInfo.pages > 0) {
			return this.getPaginationControls(this.props.paginationInfo.pages, this.props.paginationInfo.page);
		} return '';
	}

	getPaginationControls = (howMany, current) => {
		let arr = Array.from(new Array(howMany + 1).fill(0).map((item, i) => i));
		arr.splice(0, 1);
		return (<div className={styles.pagination}>
			{howMany > 1 && current > 1 &&
				<a onClick={this.props.onPageClick.bind(this, arr[current - 2])} className={styles.fake_link}>&laquo;</a>
			}
			{
				arr.map(item => (<a onClick={this.props.onPageClick.bind(this, item)} className={current == item ? styles.current : 'fake_link'}>
					{item}
				</a>))
			}
			{howMany > 1 && current < arr.length && <a onClick={this.props.onPageClick.bind(this, arr[current])} className={styles.fake_link}>&raquo;</a>}
		</div>);
	}

	validateItem(_item) { _item.isValidField = true; return true; }

	setCollection() {
		let collection = this.props.collection;
		if (!this.props.customSearch) {
			if (collection && !this.state.searchVal) {
				this.setState({ collection });
			}

			if (this.state.searchVal) {
				this.onSearch(false, collection);
			}
		}
		else {
			this.setState({ collection });
		}
	}

	componentWillMount() {
		this.setCollection();
	}
	componentWillReceiveProps() {

		this.setCollection();
	}


	render() {
		// this.onSearch(this.searchVal);
		return (
			<span>
				{this.props.search && this.state.collection && (this.state.collection.length > 0 || this.props.customSearch) && <div className="row">
					<div className="col-5">
						{!this.props.customSearch &&
							<input type="text" onKeyup={() => { this.onSearch(event); }} value={this.state.searchVal} name="searchVal" placeholder={`Search ${this.props.searchOn.join(', ').split('.').join(' ')}`} />
						}{
							this.props.customSearch &&
							<input type="text" onKeyUp={() => { this.setState({ searchVal: event.target.value }); this.onSearch(event); }} value={this.state.searchVal} name="searchVal" placeholder="Press enter to search" />

						}
					</div>
				</div>}
				<table class={this.props.customClass}>
					<thead>
						<tr>
							{this.props.head && this.props.head.map(_h => <th className={_h}> {this.formatHead(_h)} </th>)}
						</tr>

					</thead>
					<tbody>
						{this.state.collection &&
							this.state.collection.map(_item => (
								(void 0 !== _item && void 0 === _item.isValidField || _item.isValidField) && (<tr>
									{this.props.head &&
										this.props.head.map(_h => <td> {this.formatCell(_item, _h)} </td>)}
								</tr>)
							))}
					</tbody>
				</table>
				{
					this.getFooter()
				}
			</span>
		);
	}
}


String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

export default CustomTable;

