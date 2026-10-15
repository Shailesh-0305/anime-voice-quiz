import React, { useState, useEffect } from 'react';

export default function SceneManagerModal({
  isOpen,
  onClose,
  scenes,
  onUpdateScenes
}) {
  const [fileStatuses, setFileStatuses] = useState({});
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScene, setNewScene] = useState({
    characterName: '',
    anime: '',
    voiceActor: '',
    quote: '',
    videoFilename: '',
    difficulty: 'easy'
  });

  useEffect(() => {
    if (!isOpen) {
      setPreviewVideoUrl(null);
      return;
    }

    // Check all scenes in parallel
    const checks = {};
    Promise.all(
      scenes.map(async (scene) => {
        try {
          const res = await fetch(`/Scenes/${scene.videoFilename}`, { method: 'HEAD' });
          checks[scene.id] = res.ok;
        } catch {
          checks[scene.id] = false;
        }
      })
    ).then(() => {
      setFileStatuses({ ...checks });
    });
  }, [isOpen, scenes]);

  if (!isOpen) return null;

  const handleTestPreview = (scene) => {
    setPreviewTitle(`${scene.characterName} (${scene.anime}) - Scenes/${scene.videoFilename}`);
    setPreviewVideoUrl(`/Scenes/${scene.videoFilename}`);
  };

  const handleAddSceneSubmit = (e) => {
    e.preventDefault();
    if (!newScene.characterName || !newScene.anime || !newScene.videoFilename) {
      alert('Please fill in character name, anime, and video filename.');
      return;
    }

    const sceneToAdd = {
      ...newScene,
      id: `custom_${Date.now()}`,
      hint: `${newScene.characterName} from ${newScene.anime}`,
      characterAvatar: '🎌',
      altFilenames: []
    };

    onUpdateScenes([...scenes, sceneToAdd]);
    setShowAddForm(false);
    setNewScene({
      characterName: '',
      anime: '',
      voiceActor: '',
      quote: '',
      videoFilename: '',
      difficulty: 'easy'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied "${text}" to clipboard!`);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-dialog glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-col">
            <h2 className="modal-title">📁 Scenes Folder Manager</h2>
            <p className="modal-subtitle">
              Folder path: <code>c:\Study\Projects\vocie_quiz\Scenes\</code>
            </p>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Instructions banner */}
          <div className="info-banner">
            <span className="info-icon">💡</span>
            <div>
              <strong>How it works:</strong>
              <p>
                Download your anime clips and save them into the <code>Scenes/</code> folder. 
                When playing the quiz, the audio plays first for guessing, and the full scene video is revealed upon answering!
              </p>
            </div>
          </div>

          {/* Video Preview Player if active */}
          {previewVideoUrl && (
            <div className="modal-preview-stage">
              <div className="preview-header-bar">
                <span>🎥 Preview: {previewTitle}</span>
                <button type="button" className="btn-close-preview" onClick={() => setPreviewVideoUrl(null)}>Close Preview</button>
              </div>
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                className="modal-preview-video"
                onError={() => {
                  alert('Video file not found in Scenes/ folder yet. Please make sure the filename matches and the file is in the folder.');
                  setPreviewVideoUrl(null);
                }}
              />
            </div>
          )}

          {/* Scenes List Table */}
          <div className="scenes-table-container">
            <div className="scenes-table-header">
              <span className="th-char">Character & Anime</span>
              <span className="th-file">Expected File in Scenes/</span>
              <span className="th-status">Status</span>
              <span className="th-action">Actions</span>
            </div>

            <div className="scenes-table-body">
              {scenes.map((scene) => {
                const isFound = fileStatuses[scene.id];
                return (
                  <div key={scene.id} className="scenes-table-row">
                    <div className="td-char">
                      <span className="char-badge">{scene.characterAvatar || '🎬'}</span>
                      <div>
                        <strong>{scene.characterName}</strong>
                        <div className="sub-anime">{scene.anime}</div>
                      </div>
                    </div>

                    <div className="td-file">
                      <code className="file-code" onClick={() => copyToClipboard(scene.videoFilename)} title="Click to copy filename">
                        {scene.videoFilename}
                      </code>
                    </div>

                    <div className="td-status">
                      {isFound ? (
                        <span className="status-pill status-ready">🟢 Ready</span>
                      ) : (
                        <span className="status-pill status-waiting" title="Download clip and save to Scenes folder">🟡 Waiting for file</span>
                      )}
                    </div>

                    <div className="td-action">
                      <button
                        type="button"
                        className="btn-row-action"
                        onClick={() => handleTestPreview(scene)}
                        title="Test playback from Scenes folder"
                      >
                        ▶️ Test
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Custom Scene Section */}
          <div className="custom-scene-section">
            {!showAddForm ? (
              <button
                type="button"
                className="btn-show-add"
                onClick={() => setShowAddForm(true)}
              >
                ➕ Add Another Anime Scene to Quiz
              </button>
            ) : (
              <form className="add-scene-form glass-panel" onSubmit={handleAddSceneSubmit}>
                <h3>Add New Scene Question</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Character Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Satoru Gojo"
                      value={newScene.characterName}
                      onChange={(e) => setNewScene({ ...newScene, characterName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Anime Series *</label>
                    <input
                      type="text"
                      placeholder="e.g. Jujutsu Kaisen"
                      value={newScene.anime}
                      onChange={(e) => setNewScene({ ...newScene, anime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Video Filename in Scenes/ *</label>
                    <input
                      type="text"
                      placeholder="e.g. gojo_scene.mp4"
                      value={newScene.videoFilename}
                      onChange={(e) => setNewScene({ ...newScene, videoFilename: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Voice Actor (CV)</label>
                    <input
                      type="text"
                      placeholder="e.g. Yuichi Nakamura"
                      value={newScene.voiceActor}
                      onChange={(e) => setNewScene({ ...newScene, voiceActor: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Iconic Scene Quote / Dialogue</label>
                    <input
                      type="text"
                      placeholder="e.g. Domain Expansion: Infinite Void"
                      value={newScene.quote}
                      onChange={(e) => setNewScene({ ...newScene, quote: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit-scene">Save Scene to Quiz</button>
                  <button type="button" className="btn-cancel-scene" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-modal-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
