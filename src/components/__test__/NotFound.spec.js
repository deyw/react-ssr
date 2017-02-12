import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';

import NotFound from '../NotFound';

describe('NotFound component', () => {
  it('NotFound should render text: Sorry! Page not found', () => {
    const wrapper = shallow(<NotFound />);
    expect(wrapper.text()).toEqual('Sorry! Page not found');
  });
});
