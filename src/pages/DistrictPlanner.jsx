import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { PageHeader, Card, DemandBadge } from '../components/ui'
import { DISTRICTS, DISTRICT_TRAINING } from '../data/seedData'

const FALLBACK = {
  demand: [{ industry: 'Information Technology', level: 'MEDIUM' }],
  capacity: [{ course: 'Data Analytics', seats: 120 }],
  recommendations: [{ action: 'Collect more district-level placement data to generate a confident recommendation', change: '', priority: 'LOW' }],
  trainers: 12, equipment: ['General training equipment'],
}

export default function DistrictPlanner() {
  const [districtId, setDistrictId] = useState(DISTRICTS[0].id)
  const district = DISTRICTS.find(d => d.id === districtId)
  const plan = DISTRICT_TRAINING[districtId] || FALLBACK

  return (
    <div>
      <PageHeader title="District Training Planner" description="Match training capacity to district-level industry demand and get seat, trainer and equipment recommendations." />

      <div className="mb-6">
        <select
          value={districtId}
          onChange={e => setDistrictId(e.target.value)}
          className="bg-white border border-ink-400/20 rounded-md px-3 py-2 text-sm font-medium text-navy-900 focus:outline-none focus:border-teal-500"
        >
          {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}, {d.state}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-0 overflow-hidden">
          <MapContainer center={[district.lat, district.lng]} zoom={7} style={{ height: 280, width: '100%' }} scrollWheelZoom={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[district.lat, district.lng]}>
              <Popup>{district.name}, {district.state}</Popup>
            </Marker>
          </MapContainer>
        </Card>

        <Card>
          <div className="font-medium text-navy-900 mb-3">Industry demand — {district.name}</div>
          <div className="space-y-2">
            {plan.demand.map(d => (
              <div key={d.industry} className="flex items-center justify-between text-sm border-b border-ink-400/10 pb-2 last:border-0">
                <span className="text-ink-900">{d.industry}</span>
                <DemandBadge level={d.level} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="font-medium text-navy-900 mb-3">Current training capacity</div>
          <div className="space-y-2 text-sm">
            {plan.capacity.map(c => (
              <div key={c.course} className="flex items-center justify-between border-b border-ink-400/10 pb-2 last:border-0">
                <span className="text-ink-900">{c.course}</span>
                <span className="font-figure text-ink-600">{c.seats} seats</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-ink-400/10 text-sm text-ink-600 flex justify-between">
            <span>Trainers available</span>
            <span className="font-figure text-ink-900">{plan.trainers}</span>
          </div>
          <div className="mt-2 text-sm">
            <div className="text-ink-600 mb-1">Equipment</div>
            <div className="flex flex-wrap gap-1.5">
              {plan.equipment.map(e => <span key={e} className="px-2 py-0.5 bg-navy-900/5 text-navy-900 rounded text-xs">{e}</span>)}
            </div>
          </div>
        </Card>

        <Card>
          <div className="font-medium text-navy-900 mb-3">AI recommendations</div>
          <div className="space-y-3">
            {plan.recommendations.map((r, i) => (
              <div key={i} className="flex items-start justify-between gap-3 text-sm border-b border-ink-400/10 pb-3 last:border-0 last:pb-0">
                <div className="text-ink-900">{r.action}{r.change && <span className="font-figure text-teal-600"> ({r.change})</span>}</div>
                <DemandBadge level={r.priority === 'HIGH' ? 'VERY HIGH' : r.priority === 'MEDIUM' ? 'MEDIUM' : 'LOW'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
