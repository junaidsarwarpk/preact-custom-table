# custom-table

## CLI Commands

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# test the production build locally
npm run serve

# run tests with jest and preact-render-spy
npm run test
```

#The project includes custom Preact Component (Custom Table) which enables you to:

#> Specify particular columns within the collection to draw the table
#> Specify custom class to table
#> Optionally allow you to paginate the items
#> Offers callback on page change
#> Optionally allows search field within the collection on specific columns
#> Optionally allows server side search
#> Draw custom templates for any column specified in the column list
#> Rename any column using `AS` keyword i.e. head={['id AS Customer ID', 'title']}
#> Auto formats the columns to first upper, replaces . and \_ with space and capitalizes next letter's first character
#> Allows you to render deep property in the table i.e. head={['id', 'customer.info.name.full AS Customer Name']}
