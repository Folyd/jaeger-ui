// Copyright (c) 2020 Uber Technologies, Inc.
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

import React from 'react';
import { shallow } from 'enzyme';
import { Modal } from 'antd';

import SidePanel from '.';
import * as getConfig from '../../../utils/config/get-config';

describe('<SidePanel>', () => {
  let getConfigValueSpy;
  const testAcronym = 'TA';
  const testID = 'test ID';
  const mockConfig = [
    {
      id: 'first',
      acronym: '1st',
      name: 'First Decoration',
    },
    {
      id: testID,
      acronym: testAcronym,
      name: 'Decoration to test interactions',
    },
    {
      id: 'last',
      acronym: 'LO',
      name: 'The last one',
    },
  ];
  const testVertex = { service: 'svc', operation: 'op' };


  beforeAll(() => {
    getConfigValueSpy = jest.spyOn(getConfig, 'getConfigValue').mockReturnValue(mockConfig);
  });

  describe('constructor', () => {
    it('inits decorations', () => {
      const wrapper = shallow(<SidePanel />);
      expect(wrapper.instance().decorations).toBe(mockConfig);
    });
  });

  describe('render', () => {
    it('renders null if there are no decorations', () => {
      getConfigValueSpy.mockReturnValueOnce(undefined);
      const wrapper = shallow(<SidePanel />);
      expect(wrapper.getElement()).toBe(null);
    });

    it('renders config decorations with clear button', () => {
      const wrapper = shallow(<SidePanel />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders selected decoration', () => {
      const wrapper = shallow(<SidePanel selectedDecoration={testID} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('ignores selectedVertex without selected decoration', () => {
      const wrapper = shallow(<SidePanel selectedVertex={testVertex} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('renders sidePanel and closeBtn when vertex and decoration are both selected', () => {
      const wrapper = shallow(<SidePanel selectedDecoration={testID} selectedVertex={testVertex} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('clearSelected', () => {
    it('clears selected and tracks clearing', () => {
      const clearSelected = jest.fn();
      const wrapper = shallow(<SidePanel selectedVertex={testVertex} clearSelected={clearSelected} />);
      expect(clearSelected).toHaveBeenCalledTimes(0);

      wrapper
        .find('button')
        .at(0)
        .simulate('click');
      expect(clearSelected).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectDecoration', () => {
    const selectDecoration = jest.fn();

    beforeEach(() => {
      selectDecoration.mockReset();
    });

    it('selects decoration and tracks selection', () => {
      const wrapper = shallow(<SidePanel selectDecoration={selectDecoration} />);
      expect(selectDecoration).toHaveBeenCalledTimes(0);

      wrapper.find(`button[children="${testAcronym}"]`).simulate('click');
      expect(selectDecoration).toHaveBeenCalledTimes(1);
    });

    it('clears decoration and tracks clear', () => {
      const wrapper = shallow(<SidePanel selectDecoration={selectDecoration} selectedDecoration={testID} />);
      expect(selectDecoration).toHaveBeenCalledTimes(0);

      wrapper
        .find('.Ddg--SidePanel--DecorationBtns > button')
        .last()
        .simulate('click');
      expect(selectDecoration).toHaveBeenCalledTimes(1);
    });
  });

  describe('info button ', () => {
    let modalInfoSpy;

    beforeAll(() => {
      modalInfoSpy = jest.spyOn(Modal, 'info');
    });

    it('opens info modal', () => {
      const wrapper = shallow(<SidePanel />);
      expect(modalInfoSpy).toHaveBeenCalledTimes(0);

      wrapper
        .find('button')
        .last()
        .simulate('click');
      expect(modalInfoSpy).toHaveBeenCalledTimes(1);
      expect(modalInfoSpy.mock.calls[0][0]).toMatchSnapshot();
    });
  });
});
