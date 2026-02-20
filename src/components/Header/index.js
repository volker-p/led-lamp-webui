import React from 'react'
import { PowerButton } from '../PowerButton'
import { WSReconnectButton } from '../WSReconnectButton'
import { UpdateModal } from '../UpdateModal'
import { PluginModal } from '../PluginModal'
import { EmojiBtn } from '../EmojiBtn'

export const Header = ({ powerOn, webSocketConnection }) => (
  <div className="header">
    <div className="container">
      <div className="grid-container-layout header-layout">
        <h1 className="heading">
          <span className={`status-dot ${webSocketConnection ? 'status-dot--online' : 'status-dot--offline'}`} />
          LED – {powerOn ? 'working' : 'not working'}
        </h1>
        <div className="header-actions">
          <WSReconnectButton />
          <PowerButton powerOn={powerOn} />
          <UpdateModal />
          <PluginModal />
          <EmojiBtn
            title="WiFi Settings"
            className="icon-btn"
            onClick={() => {
              window.location.href = '/wifi.html'
            }}
          >
            {String.fromCodePoint(0x1f4e1)}
          </EmojiBtn>
        </div>
      </div>
    </div>
  </div>
)
