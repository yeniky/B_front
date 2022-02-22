import React from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Title from 'components/Alerts/ConfigTitle.component';
import AlertConfig from 'components/Alerts/AlertItemConfig.component';

const Cleanup = ({ rules }) => {
  const classes = useStyles();

  return (
    <section className={classes.container}>
      <Title
        title="limpieza"
        description="Alerta de tags de limpieza en zonas determinadas."
      />
      <div className={classes.rulesList}>
        {rules &&
          rules.map((rule) => (
            <AlertConfig key={rule.id} data={rule} type={'cleanup'} />
          ))}
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '2rem 0',
  },
  rulesList: {
    margin: '1rem 0',
  },
  newRuleContainer: {
    width: '60%',
    display: 'flex',
    alignItems: 'center',
    margin: '1rem 0',
  },
  newRuleOptions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '1rem',
  },
  widthItem: {
    width: '100%',
  },
}));

export default Cleanup;
