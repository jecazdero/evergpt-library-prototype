import { useState } from 'react';
import type { Asset } from '../../data/types';
import { AssetPreview, type PreviewVersion } from '../previews/AssetPreview';

export function Preview({ asset }: { asset: Asset }) {
  const [version, setVersion] = useState<PreviewVersion>('latest');
  const live = asset.status === 'published' || asset.status === 'changes_pending';
  const v = live ? version : 'latest';

  return (
    <div className="preview-area">
      <div className="preview-bar">
        <span className="preview-label">Preview</span>
        {live && (
          <div className="seg" role="radiogroup" aria-label="Preview version">
            {(['latest', 'live'] as const).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={v === k}
                className={`seg-btn${v === k ? ' on' : ''}`}
                onClick={() => setVersion(k)}
              >
                {k === 'latest' ? 'Latest edit' : 'Live version'}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="preview-card">
        <AssetPreview asset={asset} version={v} />
      </div>
    </div>
  );
}
