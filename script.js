const examples = [
    {
        id: 1,
        title: "Neon City",
        artist: "Synthwave • 120 BPM",
        color: "linear-gradient(135deg, #450af5, #c4efd9)",
        duration: 180 // seconds
    },
    {
        id: 2,
        title: "Midnight Rain",
        artist: "Lo-fi Hip Hop",
        color: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
        duration: 145
    },
    {
        id: 3,
        title: "Cyber Chase",
        artist: "Electronic • Fast",
        color: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
        duration: 210
    },
    {
        id: 4,
        title: "Acoustic Morning",
        artist: "Folk • Chill",
        color: "linear-gradient(135deg, #84fab0, #8fd3f4)",
        duration: 160
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('promptInput');
    const resultsArea = document.getElementById('resultsArea');
    const styleOutput = document.getElementById('styleOutput');
    const lyricsOutput = document.getElementById('lyricsOutput');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.querySelector('.modal-backdrop'); // Modal backdrop
    const cancelSettings = document.getElementById('cancelSettings');
    const saveKeyBtn = document.getElementById('saveKeyBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');

    // Player Elements
    const playerTrack = document.querySelector('.track-name');
    const playerArtist = document.querySelector('.artist-name');
    const playerCover = document.querySelector('.cover-thumb');
    const playPauseBtn = document.getElementById('mainPlayBtn');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const progressBar = document.querySelector('.progress-bar');

    let isPlaying = false;
    let currentTrack = null;
    let playbackInterval;
    let currentProgress = 0;

    // Load saved key
    if (localStorage.getItem('gemini_key')) {
        apiKeyInput.value = localStorage.getItem('gemini_key');
    }

    // Modal Events
    settingsBtn.addEventListener('click', async () => {
        settingsModal.classList.remove('hidden');

        // Try to fetch API key from server (.env)
        try {
            const res = await fetch('/api/config');
            if (res.ok) {
                const data = await res.json();
                if (data.apiKey && data.apiKey !== "AIzaSy...YOUR_KEY_HERE") {
                    apiKeyInput.value = data.apiKey;
                    // Optional: Auto-save to local storage if you want persistence across sessions even if .env is removed later
                    // localStorage.setItem('gemini_key', data.apiKey);
                }
            }
        } catch (e) {
            console.log('Server config fetch failed:', e);
        }
    });

    // Close modal when clicking cancel or outside the modal content
    cancelSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_key', key);
            showToast('API Key saved successfully!');
            settingsModal.classList.add('hidden');
        } else {
            showToast('Please enter a valid API Key');
        }
    });

    // Generate Logic (Client-Side)
    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        const apiKey = localStorage.getItem('gemini_key');

        if (!apiKey) {
            showToast('Please set your Gemini API Key in Settings first.');
            settingsModal.classList.remove('hidden');
            return;
        }

        if (!prompt) return showToast('Please enter a song description');

        generateBtn.innerText = 'Creating...';
        generateBtn.disabled = true;
        // Visual indicator
        generateBtn.style.opacity = "0.7";

        try {
            const systemPrompt = `
            You are an expert songwriting assistant designed to generate content for Suno AI.
            Your task is to take a user's song idea or mood and generate:
            1. A creative Song Title (short, catchy).
            2. A set of musical style tags (genres, instruments, vibes) optimized for Suno.
            3. Full song lyrics including structure markers like [Verse], [Chorus], [Bridge], [Outro].
            
            Return the response in this exact JSON format:
            {
              "title": "string",
              "style": "string of style tags, comma separated",
              "lyrics": "string of lyrics with structure markers"
            }
            Do not include markdown formatting like \`\`\`json. Just the raw JSON object.
            
            User Request: ${prompt}
            `;

            const modelsToTry = [
                'gemini-2.0-flash',
                'gemini-2.0-flash-lite-preview-02-05',
                'gemini-2.0-flash-exp',
                'gemini-flash-latest',
                'gemini-pro-latest'
            ];

            let lastError;

            for (const model of modelsToTry) {
                try {
                    console.log(`Trying model: ${model}`);
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: systemPrompt }]
                            }]
                        })
                    });

                    if (response.status === 429) {
                        console.warn(`Quota limit hit for ${model}, trying next...`);
                        lastError = new Error(`Quota exceeded for ${model}. Trying next available model...`);
                        continue; // Try next model
                    }

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error?.message || `API Error (${model})`);
                    }

                    const data = await response.json();

                    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                        throw new Error(`Invalid response format from ${model}`);
                    }

                    const textResponse = data.candidates[0].content.parts[0].text;

                    // Clean up code blocks if present
                    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                    const result = JSON.parse(cleanJson);

                    document.getElementById('titleOutput').textContent = result.title;
                    styleOutput.textContent = result.style;
                    lyricsOutput.textContent = result.lyrics;
                    resultsArea.classList.remove('hidden');

                    // Scroll to results
                    resultsArea.scrollIntoView({ behavior: 'smooth' });

                    showToast(`Generated using ${model} ⚡`);
                    return; // Success, exit loop

                } catch (e) {
                    console.error(e);
                    lastError = e;
                    // If it's not a 429, it might be a format error or other logic error, but we continue trying fallbacks just in case
                }
            }

            // If loop finishes without success
            throw lastError || new Error('All models failed. Please try again later.');

        } catch (e) {
            console.error(e);
            showToast('Error: ' + e.message);
        } finally {
            generateBtn.innerText = 'Generate';
            generateBtn.disabled = false;
            generateBtn.style.opacity = "1";
        }
    });

    // Copy Results
    document.getElementById('copyTitle').addEventListener('click', () => copyText(document.getElementById('titleOutput').innerText));
    document.getElementById('copyStyle').addEventListener('click', () => copyText(styleOutput.innerText));
    document.getElementById('copyLyrics').addEventListener('click', () => copyText(lyricsOutput.innerText));

    // Open Suno
    document.getElementById('openSunoBtn').addEventListener('click', () => {
        window.open('https://suno.com/create', '_blank');
    });

    // Song Selection Logic
    document.querySelectorAll('.song-card').forEach(card => {
        card.addEventListener('click', () => {
            const songId = parseInt(card.dataset.song);
            loadSong(songId);
        });
    });

    // Player Logic (Simulated)
    playPauseBtn.addEventListener('click', togglePlay);

    function loadSong(id) {
        const song = examples.find(s => s.id === id);
        if (!song) return;

        currentTrack = song;
        playerTrack.textContent = song.title;
        playerArtist.textContent = song.artist;
        playerCover.style.background = song.color;

        currentProgress = 0;
        updateProgress();

        isPlaying = true;
        updatePlayIcon();
        startPlaybackSim();
    }

    function togglePlay() {
        if (!currentTrack) {
            // Load first song if none selected
            loadSong(examples[0].id);
            return;
        }
        isPlaying = !isPlaying;
        updatePlayIcon();
        if (isPlaying) startPlaybackSim();
        else stopPlaybackSim();
    }

    function updatePlayIcon() {
        const path = playIcon.querySelector('path');
        if (isPlaying) {
            // Pause Icon (Spotify style)
            path.setAttribute('d', 'M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z');
        } else {
            // Play Icon
            path.setAttribute('d', 'M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z');
        }
    }

    function startPlaybackSim() {
        stopPlaybackSim();
        playbackInterval = setInterval(() => {
            if (currentProgress < 100) {
                currentProgress += 0.5; // Simulate progress
                updateProgress();
            } else {
                togglePlay();
                currentProgress = 0;
                updateProgress();
            }
        }, 100);
    }

    function stopPlaybackSim() {
        clearInterval(playbackInterval);
    }

    function updateProgress() {
        progressBar.style.width = `${currentProgress}%`;
    }

    // Utilities
    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.remove('hidden');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000);
    }

    function copyText(text) {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard');
    }

    // Random Prompt Generation
    // promptInput is already declared at the top of the file
    const songIdeas = [
        "A cyberpunk synthwave track about a rogue AI in a neon city",
        "A melancholic acoustic ballad about lost time and autumn leaves",
        "A high-energy EDM banger for a workout playlist",
        "A smooth jazz instrumental for a rainy coffee shop vibe",
        "A heavy metal anthem about fighting dragons in space",
        "A lo-fi hip hop beat for studying and relaxing",
        "An 80s pop disco track with catchy hooks about summer love",
        "A dark ambient soundscape for a horror game background",
        "A fast-paced drum and bass track for a racing scene",
        "A soulful R&B song about late night drives"
    ];

    function setRandomPrompt() {
        const randomIdea = songIdeas[Math.floor(Math.random() * songIdeas.length)];
        // Typewriter effect
        promptInput.value = "";
        let i = 0;
        const speed = 30;

        function typeWriter() {
            if (i < randomIdea.length) {
                promptInput.value += randomIdea.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
    }

    // Add a small "Random" button next to Generate if not exists, or just use a command
    // Let's add a "Surprise Me" action to the UI dynamically for better UX
    const inputArea = document.querySelector('.input-area');
    if (!document.getElementById('randomPromptBtn')) {
        const randomBtn = document.createElement('button');
        randomBtn.id = 'randomPromptBtn';
        randomBtn.innerText = '🎲 Surprise Me';
        randomBtn.className = 'icon-text-btn';
        randomBtn.style.marginTop = '12px';
        randomBtn.style.border = 'none';
        randomBtn.style.background = 'rgba(255,255,255,0.1)';

        randomBtn.addEventListener('click', setRandomPrompt);

        // Insert before the Generate button or append to input area
        inputArea.appendChild(randomBtn);
    }


    /* --- Screen Rotation Logic (Fun Mode) --- */
    const backBtn = document.querySelector('.circle-btn:first-child');
    const fwdBtn = document.querySelector('.circle-btn:nth-child(2)');
    let currentRotation = 0;

    // Enable buttons
    backBtn.style.cursor = 'pointer';
    backBtn.disabled = false;
    fwdBtn.style.cursor = 'pointer';
    fwdBtn.disabled = false;

    function rotateScreen(deg) {
        currentRotation += deg;
        document.body.style.transition = 'transform 0.5s ease';
        document.body.style.transform = `rotate(${currentRotation}deg)`;

        // Adjust easy origin to center to prevent it flying off screen too much
        if (currentRotation % 360 !== 0) {
            document.body.style.overflow = 'hidden'; // Prevent scrollbars going wild
            document.body.style.height = '100vh';
            document.body.style.width = '100vw';
            document.body.style.position = 'fixed';
            document.body.style.top = '0';
            document.body.style.left = '0';
        } else {
            // Reset styles when back to normal
            document.body.style.overflow = 'hidden'; // Keep app feel
            document.body.style.position = 'static';
            document.body.style.transform = `rotate(0deg)`;
        }

        showToast(`Whoa! Rotated ${currentRotation}° 😵‍💫`);
    }

    backBtn.addEventListener('click', () => {
        rotateScreen(-90);
    });

    fwdBtn.addEventListener('click', () => {
        rotateScreen(90);
    });


    // Initialize "Kapalıyız" Logic mostly at the end to ensure elements exist
    const closedModal = document.getElementById('closedSignModal');

    let closedTimeout;

    function showClosedSign() {
        closedModal.classList.add('active');
        clearTimeout(closedTimeout);
        closedTimeout = setTimeout(() => {
            closedModal.classList.remove('active');
        }, 2000);
    }

    // Target elements to show "Kapalıyız"
    const closedTargets = [
        '.nav-item:not(.active):not(.logo-item)', // Sidebar items except logo/active
        '.create-playlist-btn',
        '.playlist-item',
        '.section-header a',
        '.pill-btn.dark', // Profile button
        // User requested to remove closed sign from volume/player controls
    ];

    closedTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showClosedSign();
            });
        });
    });

    // Specifically handling the nav items logic
    document.querySelector('#createNavBtn').addEventListener('click', showClosedSign);

    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.querySelector('span').innerText === 'Your Library') {
            item.addEventListener('click', showClosedSign);
        }
    });

});
