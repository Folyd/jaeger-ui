// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* eslint-disable import/first */
jest.mock('./TopNav', () => () => <div />);
jest.mock('../../utils/tracking');

import React from 'react';
import { mount } from 'enzyme';

import { mapStateToProps, PageImpl as Page } from './Page';

describe('mapStateToProps()', () => {
  it('maps state to props', () => {
    const pathname = 'a-pathname';
    const search = 'a-search';
    const state = {
      router: { location: { pathname, search } },
    };
    expect(mapStateToProps(state)).toEqual({ pathname, search });
  });
});

describe('<Page>', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      pathname: String(Math.random()),
      search: String(Math.random()),
    };
    wrapper = mount(<Page {...props} />);
  });

  it('does not explode', () => {
    expect(wrapper).toBeDefined();
  });

  describe('Page embedded', () => {
    beforeEach(() => {
      props = {
        pathname: String(Math.random()),
        search: 'embed=v0&hideGraph',
      };
      wrapper = mount(<Page {...props} />);
    });

    it('does not explode', () => {
      expect(wrapper).toBeDefined();
    });

    it('does not render Header', () => {
      expect(wrapper.find('Header').length).toBe(0);
    });
  });
});
