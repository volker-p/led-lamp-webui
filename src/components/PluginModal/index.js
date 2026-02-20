import React, { useState, useEffect } from 'react'
import { fetchPlugins, deletePlugin, uploadPluginSize, uploadPlugin } from '../../helpers/requests'
import { sendWSEvent } from '../../helpers/requests'
import { EVENTS } from '../../helpers/constants'
import { EmojiBtn } from '../EmojiBtn'

export const PluginModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [plugins, setPlugins] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const loadPlugins = () => {
    fetchPlugins().then(setPlugins).catch(() => setPlugins([]))
  }

  const handleOpen = () => {
    if (!isOpen) {
      loadPlugins()
    }
    setIsOpen(!isOpen)
  }

  const handleDelete = (filename) => {
    deletePlugin(filename).then(loadPlugins)
  }

  const handleSelectFile = (e) => {
    setFile(e.target.files[0])
  }

  const changeUploadProgress = (e) => {
    setProgress(((e.loaded / e.total) * 100).toFixed(1))
  }

  const handleUpload = () => {
    setLoading(true)
    uploadPluginSize(file.size).then(() =>
      uploadPlugin(file, changeUploadProgress).then(() => {
        sendWSEvent(EVENTS.installPlugins, null)
        loadPlugins()
        setLoading(false)
        setFile(null)
        setProgress(0)
      })
    )
  }

  return (
    <>
      <EmojiBtn title="Plugins" className="icon-btn" onClick={handleOpen}>
        {String.fromCodePoint(0x1f9e9)}
      </EmojiBtn>
      <div className={`modal-backdrop ${isOpen ? 'active' : ''}`} />
      <div className={`modal ${isOpen ? 'active' : ''}`}>
        <h2 className="modal-heading">Plugins</h2>
        <div className="plugin-list">
          {plugins.length === 0 && <div>No plugins installed.</div>}
          {plugins.map((name) => (
            <div className="plugin-item" key={name}>
              <span>{name}</span>
              <button className="button" onClick={() => handleDelete(name)}>
                Delete
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px' }}>
          <input type="file" onChange={handleSelectFile} />
        </div>
        {loading && (
          <div className="progress-bar">
            <span
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div className="modal-actions">
          <button
            className="button mr-1"
            disabled={loading || !file}
            onClick={handleUpload}
          >
            Upload
          </button>
          <button className="button" disabled={loading} onClick={handleOpen}>
            Close
          </button>
        </div>
      </div>
    </>
  )
}
