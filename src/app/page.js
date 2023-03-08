'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { Select } from 'antd'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function EventList({ eventsByDate }) {
  // console.log(eventsByDate[Object.keys(eventsByDate).map(date => date)[0]])
  return (
    <div className='text-white'>
      {Object.keys(eventsByDate).map(date => (
        <>
          <h2
            className='border-y py-2 text-center border-y-slate-500'
            key={date}
          >
            {date} - {eventsByDate[date].length} events
          </h2>
          <ul className='p-3'>
            {eventsByDate[date].map(event => (
              <li key={event.id + event.channel}>{event.name}</li>
            ))}
          </ul>
        </>
      ))}
    </div>
  )
}

export default function Home() {
  /** @type {{ data: { id: string, sport: string, name: string, country: string, channel: string, dateTime: date }[] }} */
  const { data: events, error } = useSWR('/api/events', fetcher)

  const [selectedSport, setSelectedSport] = useState('*')
  const [selectedCountry, setSelectedCountry] = useState('Canada')
  const [selectedChannel, setSelectedChannel] = useState('*')

  if (events) {
    const countries = [...new Set(events.map(event => event.country))]

    const filteredEvents = events.filter(
      event =>
        (selectedCountry === '*' || selectedCountry === event.country) &&
        (selectedSport === '*' || selectedSport === event.sport) &&
        (selectedChannel === '*' || selectedChannel === event.channel)
    )

    console.log(filteredEvents.length)

    const eventsByCountry = events.reduce((acc, event) => {
      return {
        ...acc,
        [event.country]: [
          ...(acc[event.country] ? acc[event.country] : []),
          event,
        ],
      }
    }, {})

    const eventsBySport = events.reduce(
      (acc, event) => ({
        ...acc,
        [event.sport]: [...(acc[event.sport] || []), event],
      }),
      {}
    )

    const eventsByChannels = events.reduce(
      (acc, event) => ({
        ...acc,
        [event.channel]: [...(acc[event.channel] || []), event],
      }),
      {}
    )

    const eventsByDate = filteredEvents.reduce((acc, event) => {
      const dateString = new Date(event.dateTime).toLocaleDateString()
      return {
        ...acc,
        [dateString]: [...(acc[dateString] || []), event],
      }
    }, {})

    return (
      <div className='bg-slate-700'>
        <nav className='w-full border-b border-slate-500'>
          <div className='justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8'>
            <div>
              <div className='flex items-center justify-between py-1 pb-3 md:py-5 md:block'>
                <a href='#'>
                  <Image
                    alt='logo'
                    src='/logo.png'
                    width='40'
                    height='10'
                    priority
                  />
                </a>
                <div className='md:hidden'>
                  <button className='mr-2 py-1'>
                    <span className='py-1 px-2 rounded text-blue-50 text-sm font-semibold uppercase bg-orange-500'>
                      Pro
                    </span>
                  </button>
                  <button className='mr-2 py-1'>
                    <span className='py-1 px-2 rounded text-blue-50 text-sm font-semibold uppercase bg-slate-500'>
                      Login
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div id='select-container'>
          <Select
            defaultValue={selectedCountry}
            style={{ display: 'flex', flex: 1 }}
            onChange={setSelectedCountry}
          >
            {countries.sort().map(country => (
              <Select.Option key={country} value={country}>
                {country}
              </Select.Option>
            ))}
          </Select>
          <Select
            defaultValue={'Top Sports'}
            style={{ display: 'flex', flex: 1 }}
            onChange={setSelectedSport}
          >
            {Object.keys(eventsBySport)
              .sort()
              .map(sport => (
                <Select.Option key={eventsBySport[sport][0].id} value={sport}>
                  {sport}
                </Select.Option>
              ))}
          </Select>
          <Select
            defaultValue='All Channels'
            style={{ display: 'flex', flex: 1 }}
            onChange={setSelectedChannel}
          >
            {Object.keys(eventsByChannels)
              .sort()
              .map(channel => (
                <Select.Option
                  key={eventsByChannels[channel][0].id}
                  value={channel}
                >
                  {channel}
                </Select.Option>
              ))}
          </Select>
        </div>
        {/* <div className='text-white flex flex-col'>
          <p>{selectedCountry}</p>
          <p>{selectedSport}</p>
          <p>{selectedChannel}</p>
          <p>Number of filtered events: {filteredEvents.length}</p>
        </div> */}
        <EventList eventsByDate={eventsByDate} />
      </div>
    )
  }
  return <>loading</>
}
