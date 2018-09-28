import { app, search, defaultPeriod, events, establishmentRoll } from './index';
import * as types from '../actions/actionTypes';

import { setMenuOpen } from "../actions";

import moment from 'moment';

const appInitialState = {
  error: null,
  message: null,
  loaded: false
};

const appWithErrorState = {
  error: 'There was a problem',
  message: null,
  loaded: false
};

const searchInitialState = {
  locations: [],
  activities: [],
  location: '',
  activity: '',
  date: moment().format('DD/MM/YYYY'),
  period: ''
};

const establishmentRollInitialState = {
  movements: [],
  blocks: [],
  totals: null
};

const appWithValidationErrorState = {
  validationErrors: { myField: 'An error!' }
};

describe('app (global) reducer', () => {
  it('should return the initial state', () => {
    expect(app(undefined, {})).toEqual(
      {
        config: { mailTo: '' },
        user: { activeCaseLoadId: null },
        shouldShowTerms: false,
        error: null,
        message: null,
        loaded: false,
        menuOpen: false,
        showModal: {}
      }
    );
  });

  it('should handle SET_CONFIG', () => {
    expect(
      app(appInitialState, {
        type: types.SET_CONFIG,
        config: { mailTo: 'a@b.com' }
      })
    ).toEqual(
      {
        error: null,
        message: null,
        config: { mailTo: 'a@b.com' },
        loaded: false
      });
  });

  it('should handle SET_USER_DETAILS', () => {
    expect(
      app(appInitialState, {
        type: types.SET_USER_DETAILS,
        user: { field: 'value' }
      })
    ).toEqual(
      {
        error: null,
        message: null,
        user: { field: 'value' },
        loaded: false
      }
    );
  });

  it('should handle SWITCH_AGENCY', () => {
    expect(
      app(appInitialState, {
        type: types.SWITCH_AGENCY,
        activeCaseLoadId: 'BXI'
      })
    ).toEqual(
      {
        error: null,
        message: null,
        user: { activeCaseLoadId: 'BXI' },
        loaded: false
      }
    );
  });

  it('should handle SET_TERMS_VISIBILITY', () => {
    expect(
      app(appInitialState, {
        type: types.SET_TERMS_VISIBILITY,
        shouldShowTerms: true
      })
    ).toEqual(
      {
        error: null,
        message: null,
        shouldShowTerms: true,
        loaded: false
      }
    );
  });


  it('should handle SET_ERROR', () => {
    expect(
      app(appInitialState, {
        type: types.SET_ERROR,
        error: 'HELP!'
      })
    ).toEqual(
      {
        error: 'HELP!',
        message: null,
        loaded: false
      }
    );
  });

  it('should handle RESET_ERROR', () => {
    expect(
      app(appWithErrorState, {
        type: types.RESET_ERROR
      })
    ).toEqual(
      {
        error: null,
        message: null,
        loaded: false
      }
    );
  });

  it('should handle SET_MESSAGE', () => {
    expect(
      app(appInitialState, {
        type: types.SET_MESSAGE,
        message: 'An important message!'
      })
    ).toEqual(
      {
        error: null,
        message: 'An important message!',
        loaded: false
      }
    );
  });

  it('should handle SET_LOADED', () => {
    expect(
      app(appInitialState, {
        type: types.SET_LOADED,
        loaded: true
      })
    ).toEqual(
      {
        error: null,
        message: null,
        loaded: true
      }
    );
  });

  it('should handle SET_VALIDATION_ERROR (first error)', () => {
    expect(
      app(appInitialState, {
        type: types.SET_VALIDATION_ERROR,
        fieldName: 'myField',
        message: 'An error!'
      })
    ).toEqual(
      {
        error: null,
        message: null,
        loaded: false,
        validationErrors: { myField: 'An error!' }
      }
    );
  });

  it('should handle SET_VALIDATION_ERROR (second error)', () => {
    expect(
      app(appWithValidationErrorState, {
        type: types.SET_VALIDATION_ERROR,
        fieldName: 'myField2',
        message: 'Another error!'
      })
    ).toEqual(
      {
        validationErrors: {
          myField: 'An error!',
          myField2: 'Another error!'
        }
      }
    );
  });

  it('should handle RESET_VALIDATION_ERRORS', () => {
    expect(
      app(appWithValidationErrorState, {
        type: types.RESET_VALIDATION_ERRORS
      })
    ).toEqual(
      {
        validationErrors: null
      }
    );
  });

  it('should handle SET_SEARCH_LOCATIONS', () => {
    expect(
      search(searchInitialState, {
        type: types.SET_SEARCH_LOCATIONS,
        locations: ['a', 'b']
      })
    ).toEqual(
      {
        locations: ['a', 'b'],
        activities: [],
        location: '--',
        subLocation: '--',
        activity: '',
        date: moment().format('DD/MM/YYYY'),
        period: ''
      }
    );
  });

  it('should handle SET_SEARCH_LOCATION', () => {
    expect(
      search(searchInitialState, {
        type: types.SET_SEARCH_LOCATION,
        location: 'lol'
      })
    ).toEqual(
      {
        locations: [],
        activities: [],
        location: 'lol',
        subLocation: '--',
        activity: '',
        date: moment().format('DD/MM/YYYY'),
        period: ''
      }
    );
  });

  it('should handle SET_SEARCH_SUB_LOCATION', () => {
    expect(
      search(searchInitialState, {
        type: types.SET_SEARCH_SUB_LOCATION,
        subLocation: 'lollol'
      })
    ).toEqual(
      {
        locations: [],
        activities: [],
        location: '',
        subLocation: 'lollol',
        activity: '',
        date: moment().format('DD/MM/YYYY'),
        period: ''
      }
    );
  });

  it('should handle SET_SEARCH_ACTIVITIES', () => {
    expect(
      search(searchInitialState, {
        type: types.SET_SEARCH_ACTIVITIES,
        activities: ['a', 'b']
      })
    ).toEqual(
      {
        locations: [],
        activities: ['a', 'b'],
        location: '',
        activity: '',
        date: moment().format('DD/MM/YYYY'),
        period: ''
      }
    );
  });

  it('should handle SET_SEARCH_ACTIVITY', () => {
    expect(
      search(searchInitialState, {
        type: types.SET_SEARCH_ACTIVITY,
        activity: 'lol'
      })
    ).toEqual(
      {
        locations: [],
        activities: [],
        location: '',
        activity: 'lol',
        date: moment().format('DD/MM/YYYY'),
        period: ''
      }
    );
  });

  it('should handle SET_SEARCH_DATE', () => {
    expect(
      search(searchInitialState, {
        type: types.SET_SEARCH_DATE,
        date: '12/12/1999'
      })
    ).toEqual(
      {
        locations: [],
        activities: [],
        location: '',
        activity: '',
        date: '12/12/1999',
        period: ''
      }
    );
  });

  it('should handle SET_SEARCH_PERIOD', () => {
    expect(
      search(searchInitialState, {
        type: types.SET_SEARCH_PERIOD,
        period: 'teatime'
      })
    ).toEqual(
      {
        locations: [],
        activities: [],
        location: '',
        activity: '',
        date: moment().format('DD/MM/YYYY'),
        period: 'teatime'
      }
    );
  });

  it('should handle SET_HOUSEBLOCK_DATA', () => {
    expect(
      events(undefined, {
        type: types.SET_HOUSEBLOCK_DATA,
        data: ['data0', 'data1']
      })
    ).toEqual(
      {
        activityData: [],
        houseBlockData: ['data0', 'data1'],
        orderField: "cellLocation",
        sortOrder: "ASC"
      }
    );
  });

  it('should handle SET_ORDER_FIELD', () => {
    expect(
      events(undefined, {
        type: types.SET_ORDER_FIELD,
        orderField: 'field1'
      })
    ).toEqual(
      {
        activityData: [],
        houseBlockData: [],
        orderField: 'field1',
        sortOrder: "ASC"
      }
    );
  });

  it('should handle SET_ORDER', () => {
    expect(
      events(undefined, {
        type: types.SET_ORDER,
        sortOrder: 'DESC'
      })
    ).toEqual(
      {
        houseBlockData: [],
        activityData: [],
        orderField: 'cellLocation',
        sortOrder: "DESC"
      }
    );
  });

  it('should calculate current time period', () => {
    expect(
      defaultPeriod(moment('12:00 am', "HH:mm a"))
    ).toEqual('AM'
    );
    expect(
      defaultPeriod(moment('12:01 am', "HH:mm a"))
    ).toEqual('AM'
    );
    expect(
      defaultPeriod(moment('11:59:59 am', "HH:mm:ss a"))
    ).toEqual('AM'
    );
    expect(
      defaultPeriod(moment('12:00:00 pm', "HH:mm:ss a"))
    ).toEqual('PM'
    );
    expect(
      defaultPeriod(moment('16:59:59 pm', "HH:mm:ss a"))
    ).toEqual('PM'
    );
    expect(
      defaultPeriod(moment('17:00:00 pm', "HH:mm:ss a"))
    ).toEqual('ED'
    );
    expect(
      defaultPeriod(moment('11:59:59 pm', "HH:mm:ss a"))
    ).toEqual('ED'
    );
  });
  it('should handle SET_MENU_OPEN', () => {
    let state = app(appInitialState, setMenuOpen(true));

    expect(state.menuOpen).toBe(true);

    state = app(appInitialState, setMenuOpen(false));

    expect(state.menuOpen).toBe(false);
  });

  it('should handle SET_ESTABLISHMENT_ROLL_BLOCK_DATA', () => {
    expect(
      establishmentRoll(establishmentRollInitialState, {
        type: types.SET_ESTABLISHMENT_ROLL_BLOCK_DATA,
        data: {
          movements: null,
          blocks: [],
          totals: null
        }
      })
    ).toEqual(
      {
        movements: null,
        blocks: [],
        totals: null
      }
    );
  });
});
