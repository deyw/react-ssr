import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import scss from './styles.scss';

import helloMessage from './hello';

const world = require('./world').message;


storiesOf('Button', module)
  .add('with text', () => (
    <button className={scss.btn} onClick={action('clicked')}>Hello Button</button>
  ))
  .add('with some emoji', () => (
    <button onClick={action('clicked')}>{helloMessage} --- {world} </button>
  ));
