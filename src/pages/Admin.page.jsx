import React from 'react';

//redux
import { connect } from 'react-redux';

//styles components
import { makeStyles } from '@material-ui/styles';

const Admin = () => {
  const classes = useStyles();

  return (
    <section>
      <div className={classes.container}>{/* User Table */}</div>
    </section>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    padding: '2rem',
  },
}));

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(Admin);
