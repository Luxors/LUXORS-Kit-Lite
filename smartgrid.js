const smartgrid = require('smart-grid');

const settings = {
    filename: '_smart-grid',
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: "30px", /* gutter width px || % */
    oldSizeStyle: false,
    properties: [
        'justify-content'
    ],
    container: {
        maxWidth: '960px',
        fields: '30px'
    },
    breakPoints: {
        md: {
            width: "992px",
            fields: "20px"
        },
        sm: {
            width: "720px",
            fields: "10px"
        },
        xs: {
            width: "576px",
            fields: "5px"
        },
        xxs: {
            width: "380px",
            fields: "5px"
        }
        /* 
        We can create any quantity of break points.

        some_name: {
            some_width: 'Npx',
            some_offset: 'N(px|%)'
        }
        */
    },
};

smartgrid('./app/scss', settings);