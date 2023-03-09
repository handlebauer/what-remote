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
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const dateString = new Date(event.dateTime).toLocaleDateString()
    return {
      ...acc,
      [dateString]: [...(acc[dateString] || []), event],
    }
  }, {})

  return (
    <div className='min-h-screen text-white'>
      {Object.keys(eventsByDate).map(date => (
        <>
          <h2
            className='py-2 text-center border-y border-y-slate-500'
            key={date}
          >
            {date} - {eventsByDate[date].length} events
          </h2>
          <ul className='p-3'>
            {eventsByDate[date].map((event, i) => (
              <li key={event.id + event.channel + i}>{event.name}</li>
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

  return (
    <div>
      <Select
        defaultValue={selections.country}
        style={{ display: 'flex', flex: 1 }}
        onChange={setSelections('country')}
      >
        {filteredCountries.map(country => (
          <Select.Option
            key={byCountry[country][0].id + byCountry[country][0].country}
            value={country}
          >
            {country}
          </Select.Option>
        ))}
      </Select>
      <Select
        defaultValue={'Top Sports'}
        style={{ display: 'flex', flex: 1 }}
        onChange={setSelections('sport')}
      >
        {filteredSports.map((sport, i) => (
          <Select.Option
            key={bySport[sport][i].id + bySport[sport][i].sport}
            value={sport}
          >
            {sport}
          </Select.Option>
        ))}
      </Select>
      <Select
        defaultValue='All Channels'
        style={{ display: 'flex', flex: 1 }}
        onChange={setSelections('channel')}
      >
        {filteredChannels.map(channel => (
          <Select.Option
            key={byChannel[channel].id + byChannel[channel].channel}
            value={channel}
          >
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
        setSelections={type => val =>
          setSelections(state => ({ ...state, [type]: val }))}
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
