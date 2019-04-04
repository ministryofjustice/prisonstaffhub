import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import { ResultsHouseblock } from './ResultsHouseblock'
import OtherActivitiesView from '../OtherActivityListView'

const PRISON = 'LEI'

const OFFENDER_NAME_COLUMN = 0
const NOMS_ID_COLUMN = 2
const FLAGS_COLUMN = 3
const MAIN_COLUMN = 4
const OTHER_COLUMN = 5
const ATTEND_COLUMN = 6
const DONT_ATTEND_COLUMN = 7

const response = [
  {
    releaseScheduled: true,
    category: 'A',
    alertFlags: ['HA'],
    activity: {
      offenderNo: 'A1234AA',
      firstName: 'ARTHUR',
      lastName: 'ANDERSON',
      cellLocation: `${PRISON}-A-1-1`,
      event: 'PA',
      eventId: 56,
      eventType: 'PRISON_ACT',
      eventDescription: 'Prison Activities',
      comment: 'Chapel',
      startTime: '2017-10-15T18:00:00',
      endTime: '2017-10-15T18:30:00',
    },
    others: [
      {
        offenderNo: 'A1234AA',
        firstName: 'ARTHUR',
        lastName: 'ANDERSON',
        cellLocation: `${PRISON}-A-1-1`,
        event: 'VISIT',
        eventDescription: 'Visits',
        comment: 'Official Visit',
        startTime: '2017-10-15T11:00:00',
        endTime: '2017-10-15T11:30:00',
      },
      {
        offenderNo: 'A1234AA',
        firstName: 'ARTHUR',
        lastName: 'ANDERSON',
        cellLocation: `${PRISON}-A-1-1`,
        event: 'APP',
        eventDescription: 'The gym, appointment',
        comment: '',
        startTime: '2017-10-15T17:00:00',
        endTime: '2017-10-15T17:30:00',
      },
      {
        offenderNo: 'A1234AA',
        firstName: 'ARTHUR',
        lastName: 'ANDERSON',
        cellLocation: `${PRISON}-A-1-1`,
        comment: 'Appt details',
        event: 'MEDE',
        eventDescription: 'Medical - Dentist',
        startTime: '2018-06-18T11:40:00',
      },
    ],
  },
  {
    category: 'B',
    activity: {
      offenderNo: 'A1234AB',
      firstName: 'MICHAEL',
      lastName: 'SMITH',
      cellLocation: `${PRISON}-A-1-2`,
      event: 'PA',
      eventType: 'PRISON_ACT',
      eventDescription: 'Prison Activities',
      comment: 'Chapel Act',
      startTime: '2017-10-15T18:00:00',
      endTime: '2017-10-15T18:30:00',
    },
  },
  {
    category: 'H',
    activity: {
      offenderNo: 'A1234AC',
      firstName: 'FRED',
      lastName: 'QUIMBY',
      cellLocation: `${PRISON}-A-1-3`,
      event: 'PA',
      eventType: 'PRISON_ACT',
      eventDescription: 'Prison Activities',
      comment: 'Chapel Activity',
      startTime: '2017-10-15T18:00:00',
      endTime: '2017-10-15T18:30:00',
    },
    others: [
      {
        offenderNo: 'A1234AC',
        firstName: 'FRED',
        lastName: 'QUIMBY',
        cellLocation: `${PRISON}-A-1-3`,
        event: 'VISIT',
        eventStatus: 'CANC',
        eventDescription: 'Visits',
        comment: 'Family Visit',
        startTime: '2017-10-15T11:11:00',
        endTime: '2017-10-15T18:30:00',
      },
    ],
  },
  {
    category: 'P',
    activity: {
      offenderNo: 'A1234AD',
      firstName: 'John',
      lastName: 'DOE',
      cellLocation: `${PRISON}-A-1-4`,
      event: 'PA',
      eventType: 'PRISON_ACT',
      eventDescription: 'Prison Activities',
      comment: 'Chapel Act',
      startTime: '2017-10-15T18:00:00',
      endTime: '2017-10-15T18:30:00',
    },
  },
]

const subLocations = [{ name: '1', key: '1' }, { name: '2', key: '2' }]

const user = {
  activeCaseLoadId: 'SYI',
  caseLoadOptions: [
    { caseLoadId: 'XXX', description: 'Some Prison' },
    { caseLoadId: 'SYI', description: 'Shrewsbury' },
  ],
}
const mockHistory = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  listen: jest.fn(),
  location: { hash: '', pathname: '', search: '' },
  replace: jest.fn(),
}

const props = {
  activeSubLocation: '--',
  agencyId: PRISON,
  currentSubLocation: '--',
  getHouseblockList: jest.fn(),
  setColumnSort: jest.fn(),
  subLocations,
  history: mockHistory,
  handleSearch: jest.fn(),
  handlePrint: jest.fn(),
  handleSubLocationChange: jest.fn(),
  handlePeriodChange: jest.fn(),
  handleDateChange: jest.fn(),
  showPaymentReasonModal: jest.fn(),
  update: jest.fn(),
  resetErrorDispatch: jest.fn(),
  locationWithSubLocation: '1',
}

describe('Offender results component Jira NN-843', () => {
  it('should render initial offender results form correctly', async () => {
    const aFewDaysAgo = moment().subtract(3, 'days')
    const date = aFewDaysAgo.format('DD/MM/YYYY')
    const longDateFormat = aFewDaysAgo.format('dddd Do MMMM')

    const component = shallow(
      <ResultsHouseblock
        {...props}
        currentLocation="1"
        date={date}
        houseblockData={response}
        period="ED"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )
    expect(component.find('.whereabouts-date').text()).toEqual(`1 - ${longDateFormat} - ED`)

    const housingLocationSelect = component.find('#housing-location-select')
    expect(housingLocationSelect.some('[value="--"]')).toEqual(true)
    // Dig into the DatePicker component
    const searchDate = component
      .find('WhereaboutsDatePicker')
      .dive()
      .prop('input').value
    expect(searchDate).toEqual(date)
    const periodSelect = component.find('#period-select')
    expect(periodSelect.some('[value="ED"]')).toEqual(true)

    const tr = component.find('tr')
    expect(tr.at(0).contains('Prison no.'))
    expect(tr.length).toEqual(5) // 4 plus table header tr
    const row1Tds = tr.at(1).find('td')
    expect(
      row1Tds
        .at(OFFENDER_NAME_COLUMN)
        .childAt(0)
        .dive()
        .childAt(0)
        .dive()
        .text()
    ).toEqual('Anderson, Arthur')
    expect(row1Tds.at(NOMS_ID_COLUMN).text()).toEqual('A1234AA')
    // TODO: find out how to fix the following line...
    //     expect(row1Tds.at(LOCATION_COLUMN).text()).toEqual('A-1-1')
    expect(row1Tds.at(FLAGS_COLUMN).text()).toEqual('ACCTCAT\u00a0A') // non-breaking space!
    expect(row1Tds.at(MAIN_COLUMN).text()).toEqual('18:00 - Chapel')
    expect(
      row1Tds
        .at(OTHER_COLUMN)
        .find(OtherActivitiesView)
        .at(0)
        .dive()
        .find('li')
        .at(0)
        .text()
    ).toEqual('** Release scheduled **')
    expect(
      row1Tds
        .at(OTHER_COLUMN)
        .find(OtherActivitiesView)
        .at(0)
        .dive()
        .find('li')
        .at(1)
        .text()
    ).toEqual('11:00 - Visits - Official Visit')
    expect(
      row1Tds
        .at(OTHER_COLUMN)
        .find(OtherActivitiesView)
        .at(0)
        .dive()
        .find('li')
        .at(2)
        .text()
    ).toEqual('17:00 - 17:30 - The gym, appointment')
    expect(
      row1Tds
        .at(OTHER_COLUMN)
        .find(OtherActivitiesView)
        .at(0)
        .dive()
        .find('li')
        .at(3)
        .text()
    ).toEqual('11:40 - Medical - Dentist - Appt details')
    // Check not disabled. This odd looking attribute value is handled correctly in the real DOM
    expect(
      row1Tds
        .at(ATTEND_COLUMN)
        .find('input')
        .some('[type="checkbox"]')
    ).toEqual(true)
    expect(
      row1Tds
        .at(DONT_ATTEND_COLUMN)
        .find('input')
        .some('[type="checkbox"]')
    ).toEqual(true)

    const row2Tds = tr.at(2).find('td')
    expect(
      row2Tds
        .at(OFFENDER_NAME_COLUMN)
        .childAt(0)
        .dive()
        .childAt(0)
        .dive()
        .text()
    ).toEqual('Smith, Michael')
    // TODO: find out how to fix the following line
    // expect(row2Tds.at(LOCATION_COLUMN).text()).toEqual('A-1-2')
    expect(row2Tds.at(FLAGS_COLUMN).text()).toEqual('')
    expect(row2Tds.at(MAIN_COLUMN).text()).toEqual('18:00 - Chapel Act')
    expect(
      row2Tds
        .at(OTHER_COLUMN)
        .find(OtherActivitiesView)
        .at(0)
        .dive()
        .find('li').length
    ).toEqual(0)

    const row3Tds = tr.at(3).find('td')
    expect(
      row3Tds
        .at(OFFENDER_NAME_COLUMN)
        .childAt(0)
        .dive()
        .childAt(0)
        .dive()
        .text()
    ).toEqual('Quimby, Fred')
    // TODO: find out how to fix the following line
    // expect(row3Tds.at(LOCATION_COLUMN).text()).toEqual('A-1-3')
    expect(row3Tds.at(FLAGS_COLUMN).text()).toEqual('CAT\u00a0A\u00a0High')
    expect(row3Tds.at(MAIN_COLUMN).text()).toEqual('18:00 - Chapel Activity')
    expect(
      row3Tds
        .at(OTHER_COLUMN)
        .find(OtherActivitiesView)
        .at(0)
        .dive()
        .find('li')
        .at(0)
        .text()
    ).toEqual('11:11 - Visits - Family Visit (cancelled)')

    expect(
      tr
        .at(4)
        .find('td')
        .at(FLAGS_COLUMN)
        .text()
    ).toEqual('CAT\u00a0A\u00a0Prov')
  })

  it('should render empty results list correctly', async () => {
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={[]}
        period="AM"
        currentLocation="BWing"
        user={user}
        date="today"
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )
    const tr = component.find('tr')
    expect(tr.length).toEqual(1) // table header tr only
    expect(component.find('div.font-small').text()).toEqual('No prisoners found')
  })

  it('should handle buttons correctly', async () => {
    const today = moment().format('DD/MM/YYYY')
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={response}
        handlePrint={props.handlePrint}
        date={today}
        period="PM"
        currentLocation="BWing"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )

    expect(component.find('#buttons > button').some('#printButton')).toEqual(true)

    component.find('#updateButton').simulate('click')
    expect(props.update).toHaveBeenCalled()
    expect(props.handlePrint).not.toHaveBeenCalled()

    component
      .find('#printButton')
      .at(0)
      .simulate('click')
    expect(props.handlePrint).toHaveBeenCalled()
  })

  it('should not display print button when date is in the past', async () => {
    const oldDate = '25/05/2018'
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={response}
        date={oldDate}
        period="ED"
        currentLocation="BWing"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )
    expect(component.find('#buttons > button').some('#printButton')).toEqual(false)
  })

  it('should display print button when date is in the future', async () => {
    const futureDate = moment()
      .add(1, 'days')
      .format('DD/MM/YYYY')
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={response}
        date={futureDate}
        period="ED"
        currentLocation="BWing"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )
    expect(component.find('#buttons > button').some('#printButton')).toEqual(true)
  })

  it('checkboxes should be read-only when date is over a week ago', async () => {
    const oldDate = '23/05/2018'
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={response}
        handlePrint={props.handlePrint}
        date={oldDate}
        period="ED"
        currentLocation="BWing"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )

    const tr = component.find('tr')
    expect(
      tr
        .at(1)
        .find('td')
        .at(ATTEND_COLUMN)
        .find('input')
        .some('[disabled]')
    ).toEqual(true)
    expect(
      tr
        .at(1)
        .find('td')
        .at(DONT_ATTEND_COLUMN)
        .find('input')
        .some('[disabled]')
    ).toEqual(true)
  })

  it('should display the correct sorting headings for Location', async () => {
    const today = moment().format('DD/MM/YYYY')
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={response}
        handlePrint={props.handlePrint}
        date={today}
        period="ED"
        orderField="cellLocation"
        sortOrder="ASC"
        currentLocation="BWing"
        user={user}
        offenderNo="1"
      />
    )

    expect(
      component
        .find('SortableColumn')
        .at(1)
        .shallow()
        .find('#Location-sort-asc').length
    ).toEqual(1)

    expect(
      component
        .find('SortableColumn')
        .at(1)
        .shallow()
        .find('#Location-sort-desc').length
    ).toEqual(0)

    expect(
      component
        .find('SortableColumn')
        .at(0)
        .shallow()
        .find('#Name-sort-desc').length
    ).toEqual(0)

    expect(
      component
        .find('SortableColumn')
        .at(0)
        .shallow()
        .find('#Name-sort-asc').length
    ).toEqual(0)
  })

  it('should display the correct sorting headings for Name', async () => {
    const today = moment().format('DD/MM/YYYY')
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={response}
        handlePrint={props.handlePrint}
        date={today}
        period="ED"
        orderField="lastName"
        sortOrder="DESC"
        currentLocation="BWing"
        user={user}
        offenderNo="1"
      />
    )

    expect(
      component
        .find('SortableColumn')
        .at(1)
        .shallow()
        .find('#Location-sort-asc').length
    ).toEqual(0)

    expect(
      component
        .find('SortableColumn')
        .at(1)
        .shallow()
        .find('#Location-sort-desc').length
    ).toEqual(0)

    expect(
      component
        .find('SortableColumn')
        .at(0)
        .shallow()
        .find('#Name-sort-desc').length
    ).toEqual(1)

    expect(
      component
        .find('SortableColumn')
        .at(0)
        .shallow()
        .find('#Name-sort-asc').length
    ).toEqual(0)
  })

  it('should handle change of sort order', async () => {
    const today = moment().format('DD/MM/YYYY')
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={response}
        handlePrint={props.handlePrint}
        setColumnSort={props.setColumnSort}
        date={today}
        period="ED"
        orderField="cellLocation"
        sortOrder="ASC"
        currentLocation="BWing"
        user={user}
        offenderNo="1"
      />
    )

    component
      .find('SortableColumn')
      .at(1)
      .shallow()
      .find('#Location-sort-asc')
      .simulate('click')

    expect(props.setColumnSort).toHaveBeenCalledWith('cellLocation', 'DESC')

    component
      .find('SortableColumn')
      .at(0)
      .shallow()
      .find('#Name-sortable-column')
      .simulate('click')

    expect(props.setColumnSort).toHaveBeenCalledWith('lastName', 'ASC')
  })

  it('should show released today when there are no other activity', () => {
    const data = [
      {
        releaseScheduled: true,
        activity: {
          offenderNo: 'A1234AA',
          firstName: 'ARTHUR',
          lastName: 'ANDERSON',
          cellLocation: `${PRISON}-A-1-1`,
          event: 'PA',
          eventId: 56,
          eventType: 'PRISON_ACT',
          eventDescription: 'Prison Activities',
          comment: 'Chapel',
          startTime: '2017-10-15T18:00:00',
          endTime: '2017-10-15T18:30:00',
        },
      },
    ]
    const aFewDaysAgo = moment().subtract(3, 'days')
    const date = aFewDaysAgo.format('DD/MM/YYYY')
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={data}
        date={date}
        period="ED"
        currentLocation="BWing"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )

    const tr = component.find('tr')
    expect(
      tr
        .at(1)
        .find('td')
        .at(OTHER_COLUMN)
        .find(OtherActivitiesView)
        .at(0)
        .dive()
        .find('li')
        .at(0)
        .text()
    ).toEqual('** Release scheduled **')
  })

  it('Should render sub-locations in drop-down', () => {
    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={[]}
        date={moment().format('DD/MM/YYYY')}
        period="ED"
        currentLocation="BWing"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )

    const options = component.find('#housing-location-select option')
    expect(options.length).toEqual(3)
    expect(options.contains(<option value="--">All</option>)).toEqual(true)
    expect(options.contains(<option value="1">1</option>)).toEqual(true)
    expect(options.contains(<option value="2">2</option>)).toEqual(true)
  })

  it('should show transfer scheduled in the other activities column', () => {
    const data = [
      {
        releasedToday: false,
        scheduledTransfers: [{ eventId: 100, eventDescription: 'Transfer scheduled', scheduled: true }],
        activity: {
          offenderNo: 'A1234AA',
          firstName: 'ARTHUR',
          lastName: 'ANDERSON',
          cellLocation: `${PRISON}-A-1-1`,
          event: 'PA',
          eventId: 56,
          eventType: 'PRISON_ACT',
          eventDescription: 'Prison Activities',
          comment: 'Chapel',
          startTime: '2017-10-15T18:00:00',
          endTime: '2017-10-15T18:30:00',
        },
      },
    ]
    const aFewDaysAgo = moment().subtract(3, 'days')
    const date = aFewDaysAgo.format('DD/MM/YYYY')

    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={data}
        date={date}
        period="ED"
        currentLocation="BWing"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )

    const tr = component.find('tr')
    expect(
      tr
        .at(1)
        .find('td')
        .at(OTHER_COLUMN)
        .find(OtherActivitiesView)
        .at(0)
        .dive()
        .find('li')
        .at(0)
        .text()
    ).toEqual('** Transfer scheduled ** ')
  })

  it('should show multiple scheduled transfers along with status description', () => {
    const data = [
      {
        releasedToday: false,
        scheduledTransfers: [
          { eventId: 100, eventDescription: 'Transfer scheduled', scheduled: true },
          { eventId: 101, eventDescription: 'Transfer scheduled', cancelled: true },
          { eventId: 102, eventDescription: 'Transfer scheduled', complete: true },
          { eventId: 103, eventDescription: 'Transfer scheduled', expired: true },
        ],
        activity: {
          offenderNo: 'A1234AA',
          firstName: 'ARTHUR',
          lastName: 'ANDERSON',
          cellLocation: `${PRISON}-A-1-1`,
          event: 'PA',
          eventId: 56,
          eventType: 'PRISON_ACT',
          eventDescription: 'Prison Activities',
          comment: 'Chapel',
          startTime: '2017-10-15T18:00:00',
          endTime: '2017-10-15T18:30:00',
        },
      },
    ]
    const aFewDaysAgo = moment().subtract(3, 'days')
    const date = aFewDaysAgo.format('DD/MM/YYYY')

    const component = shallow(
      <ResultsHouseblock
        {...props}
        houseblockData={data}
        date={date}
        period="ED"
        currentLocation="BWing"
        user={user}
        orderField="cellLocation"
        sortOrder="ASC"
        offenderNo="1"
      />
    )

    const transfers = component
      .find(OtherActivitiesView)
      .dive()
      .find('.transfer')

    expect(transfers.at(0).text()).toBe('** Transfer scheduled ** ')

    expect(transfers.at(1).text()).toBe('** Transfer scheduled ** (cancelled)')
    expect(
      transfers
        .at(1)
        .find('span')
        .last()
        .getElement().props.className
    ).toBe('cancelled')

    expect(transfers.at(2).text()).toBe('** Transfer scheduled ** (complete)')
    expect(
      transfers
        .at(2)
        .find('span')
        .last()
        .getElement().props.className
    ).toBe('complete')

    expect(transfers.at(3).text()).toBe('** Transfer scheduled ** (expired)')
    expect(
      transfers
        .at(3)
        .find('span')
        .last()
        .getElement().props.className
    ).toBe('cancelled')
  })

  // TODO Skipped for Part 1
  it.skip('should call showPaymentReasonModal with event and offender information', () => {
    const component = shallow(
      <ResultsHouseblock
        {...props}
        user={{}}
        houseblockData={[response[0]]}
        showPaymentReasonModal={props.showPaymentReasonModal}
        orderField="cellLocation"
        sortOrder="ASC"
        currentLocation="BWing"
        offenderNo="1"
      />
    )

    const browserEvent = {
      target: {
        value: 'dummy',
      },
    }
    component
      .find('#col4_0')
      .last()
      .simulate('change', browserEvent)

    expect(props.showPaymentReasonModal).toHaveBeenCalledWith(response[0].activity[0], browserEvent)
  })
})
