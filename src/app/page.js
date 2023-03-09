'use client'

import { useState } from 'react'
import { Select } from 'antd'

import useSWR from 'swr'
import { fetcher } from '../../lib/utils/fetcher.js'
import Nav from './components/Nav.js'
import { groupBy } from '../../lib/utils/group-by.js'

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} name
 * @property {string} country
 * @property {string} sport
 * @property {string} channel
 * @property {string} dateTime
 */

/** @typedef {{ [key: string]: Event[] }} EventsBy */

/**
 * @param {{ filteredEvents: Event[] }}
 */
function EventList({ filteredEvents }) {
  const eventsByDate = filteredEvents.reduce((acc, { channel, ...event }) => {
    const dateString = new Date(event.dateTime).toLocaleDateString()
    const existingChannels = acc[dateString]?.[event.name]?.channels || []
    return {
      ...acc,
      [dateString]: {
        ...acc[dateString],
        [event.name]: {
          ...event,
          channels: [...existingChannels, channel],
        },
      },
    }
  }, {})

  return (
    <div className='min-h-screen text-white'>
      {Object.entries(eventsByDate).map(([date, eventsByName]) => (
        <>
          <h2 className='py-2 text-center' key={date}>
            {date} - {Object.keys(eventsByName).length} events
          </h2>
          <ul className='p-3 space-y-3 text-[13px]'>
            {Object.entries(eventsByName).map(([name, event], i) => (
              <>
                <li key={i} className='flex items-center w-full h-32 max-h-60'>
                  <div className='flex flex-col items-center justify-center w-[50%] px-2'>
                    {name.split(' vs ').map((team, i) => (
                      <div key={i}>{team}</div>
                    ))}
                  </div>
                  <div>
                    {event.channels.map((channel, i) => (
                      <div
                        key={i}
                        className='px-2 text-center py-[0.2rem] my-1 mr-2 w-min whitespace-nowrap rounded bg-slate-600'
                      >
                        {channel}
                      </div>
                    ))}
                  </div>
                </li>
                <div className='w-full h-1 border-b border-slate-600' />
              </>
            ))}
          </ul>
        </>
      ))}
    </div>
  )
}

/**
 * @param {{ byCountry: EventsBy, bySport: EventsBy, byChannel: EventsBy, selections: { [key: string]: string }, setSelections: Dispatch<SetStateAction<{country: string; sport: string; channel: string;}>> }}
 */
function FilterControls({
  byCountry,
  bySport,
  byChannel,
  selections,
  setSelections,
}) {
  const filteredCountries = Object.entries(byCountry)
    .filter(Boolean)
    .map(([country]) => country)

  const filteredSports = Object.entries(bySport)
    .filter(
      ([_, events]) =>
        selections.country === '*' ||
        events.some(event => event.country === selections.country)
    )
    .map(([sport]) => sport)

  const filteredChannels = Object.entries(byChannel)
    .filter(([_, events]) => {
      if (selections.country === '*' && selections.sport === '*') {
        return true
      }
      if (selections.country !== '*' && selections.sport === '*') {
        return events.some(event => event.country === selections.country)
      }
      return events.some(
        event =>
          event.country === selections.country &&
          event.sport === selections.sport
      )
    })
    .map(([channel]) => channel)

  const handleSelection = kind => val => {
    console.log(kind, val)
    if (kind === 'country') {
      setSelections({ country: val, sport: '*', channel: '*' })
      return
    }
    if (kind === 'sport') {
      console.log('got here')
      setSelections(state => ({ ...state, sport: val, channel: '*' }))
      return
    }
    setSelections(state => ({ ...state, [kind]: val }))
    return
  }

  return (
    <div>
      <Select
        defaultValue={selections.country}
        style={{ display: 'flex', flex: 1 }}
        onChange={handleSelection('country')}
      >
        {filteredCountries.map((country, i) => (
          <Select.Option key={i} value={country}>
            {country}
          </Select.Option>
        ))}
      </Select>
      <Select
        defaultValue='Top Sports'
        style={{ display: 'flex', flex: 1 }}
        onChange={handleSelection('sport')}
      >
        {filteredSports.map((sport, i) => (
          <Select.Option key={i} value={sport}>
            {sport}
          </Select.Option>
        ))}
      </Select>
      <Select
        defaultValue='All Channels'
        style={{ display: 'flex', flex: 1 }}
        onChange={handleSelection('channel')}
      >
        {filteredChannels.map((channel, i) => (
          <Select.Option key={i} value={channel}>
            {channel}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

/**
 * @param {{ country: string, events: Event[] }}
 */
function Home({ country, events }) {
  const [selections, setSelections] = useState({
    country,
    sport: '*',
    channel: '*',
  })

  const byCountry = groupBy('country', events)
  const bySport = groupBy('sport', events)
  const byChannel = groupBy('channel', events)

  const filteredEvents = events.filter(event => {
    const { country, sport, channel } = selections
    return (
      (country == '*' || event.country === country) &&
      (sport === '*' || event.sport === sport) &&
      (channel === '*' || event.channel === channel)
    )
  })

  return (
    <div className='bg-slate-700'>
      <Nav />
      <FilterControls
        byCountry={byCountry}
        bySport={bySport}
        byChannel={byChannel}
        selections={selections}
        setSelections={setSelections}
      />
      <EventList filteredEvents={filteredEvents} />
    </div>
  )
}

export default function Main() {
  /** @type {{ data: Event[] }} */
  const { data: events } = useSWR('/api/events', fetcher)
  const { data: geo } = useSWR('/api/geo', fetcher)

  if (geo && events) {
    return <Home country={geo.country.name} events={events} />
  }
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      Loading...
    </div>
  )
}
