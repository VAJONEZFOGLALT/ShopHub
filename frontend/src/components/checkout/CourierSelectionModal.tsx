import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CourierOption {
  id: string;
  name: string;
  price: number;
  days: string;
  type: 'address' | 'pickup' | 'both';
}

interface CourierSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  couriers: CourierOption[];
  selectedCourier: string;
  onSelect: (courierId: string, location?: string) => void;
}

export function CourierSelectionModal({
  isOpen,
  onClose,
  couriers,
  selectedCourier,
  onSelect,
}: CourierSelectionModalProps) {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState('');

  const selectedCourierData = couriers.find((c) => c.id === selectedCourier);

  const handleSelect = () => {
    onSelect(selectedCourier, selectedLocation || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content courier-selection-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('checkout.selectDelivery')}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="courier-list">
            {couriers.map((courier) => (
              <label key={courier.id} className="courier-option">
                <input
                  type="radio"
                  name="courier"
                  value={courier.id}
                  checked={selectedCourier === courier.id}
                  onChange={() => setSelectedLocation('')}
                  onClick={() => {
                    selectedCourier === courier.id ? onSelect(courier.id, selectedLocation || undefined) : null;
                  }}
                />
                <div className="courier-info">
                  <div className="courier-name">{courier.name}</div>
                  <div className="courier-details">
                    <span className="courier-price">${courier.price.toFixed(2)}</span>
                    <span className="courier-days">{courier.days}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {selectedCourierData?.type !== 'address' && (
            <div className="location-selection">
              <h3>{t('checkout.selectLocation')}</h3>
              <p className="muted">
                {selectedCourierData?.id === 'PACKETA'
                  ? t('checkout.packetaInfo')
                  : t('checkout.glsInfo')}
              </p>
              <input
                type="text"
                placeholder={t('checkout.searchLocation')}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="location-search"
              />
              <button className="btn-secondary" style={{ width: '100%', marginTop: '12px' }}>
                {t('checkout.openMap')}
              </button>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            className="btn-primary"
            onClick={handleSelect}
            disabled={selectedCourierData?.type !== 'address' && !selectedLocation}
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
