import { useMemo } from 'react'

export function MapPicker({ value, onChange }) {
  const lat = value?.lat || ''
  const lng = value?.lng || ''
  const mapUrl = useMemo(() => {
    if (!lat || !lng) return ''
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  }, [lat, lng])

  const detectLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        })
      },
      () => {},
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  return (
    <div className="map-picker">
      <div className="map-picker-row">
        <label>
          Latitude
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(event) => onChange({ ...value, lat: Number(event.target.value) })}
            placeholder="e.g. 28.6139"
          />
        </label>
        <label>
          Longitude
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(event) => onChange({ ...value, lng: Number(event.target.value) })}
            placeholder="e.g. 77.2090"
          />
        </label>
      </div>
      <div className="map-picker-actions">
        <button type="button" className="btn btn-dark" onClick={detectLocation}>
          Auto-detect location
        </button>
        {lat && lng && (
          <a
            className="btn btn-link"
            href={`https://maps.google.com/?q=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
          </a>
        )}
      </div>
      {mapUrl ? (
        <iframe title="Issue map preview" src={mapUrl} className="map-frame" loading="lazy" />
      ) : (
        <p className="muted">Add coordinates or auto-detect to preview location.</p>
      )}
    </div>
  )
}
