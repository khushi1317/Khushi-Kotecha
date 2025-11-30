const yearData = {
    1: {
        text: "This is my first year! I was just a tiny bundle of joy.",
        video: "assets/Year1.mp4",
        audio: "audio/year1.mp3"
    },
    2: {
        text: "Year 2: I started walking and exploring the world!",
        img: "assets/1TO10/2Y.PNG",
        audio: "audio/year2.mp3"
    },
    3: {
        text: "Year 3: Early adventures.",
        img: ["assets/1TO10/3Y.PNG", "assets/1TO10/3Y1.PNG"],
        audio: "audio/year3.mp3"
    },
    4: {
        text: "Year 4: Growing up.",
        img: "assets/1TO10/4Y.PNG",
        audio: "audio/year4.mp3"
    },
    5: {
        text: "Year 5: Little milestones.",
        img: "assets/1TO10/5Y.PNG",
        audio: "audio/year5.mp3"
    },
    6: {
        text: "Year 6: School days.",
        img: "assets/1TO10/6Y.JPEG",
        audio: "audio/year6.mp3"
    },
    7: {
        text: "Year 7: New friends.",
        img: "assets/1TO10/7Y.JPEG",
        audio: "audio/year7.mp3"
    },
    8: {
        text: "Year 8: Adventures continue.",
        img: "assets/1TO10/8Y.JPEG",
        audio: "audio/year8.mp3"
    },
    9: {
        text: "Year 9: Growing memories.",
        img: "assets/1TO10/9Y.JPEG",
        audio: "audio/year9.mp3"
    },
    10: {
        text: "Year 10: A decade of memories.",
        img: "assets/1TO10/10Y.JPEG",
        audio: "audio/year10.mp3"
    }
    ,
    11: {
        text: "Year 11: New chapter.",
        video: "assets/year11.mp4",
        audio: "audio/year11.mp3"
    }
    // Add remaining years up to 25 as needed
};

function openYear(year){
    const contentDiv = document.getElementById('yearContent');
    const data = yearData[year];
    if(!contentDiv) return;

    if(!data){
        contentDiv.innerHTML = `<h2>Year ${year}</h2><p>Content coming soon.</p>`;
        return;
    }

    let html = `<h2>Year ${year}</h2>`;
    if(data.text) html += `<p>${data.text}</p>`;
    if(data.video){
        html += `<div class="year-video-wrap"><video controls class="year-video" src="${data.video}"></video></div>`;
    } else if(data.img){
        if(Array.isArray(data.img)){
            html += `<div class="year-gallery">`;
            data.img.forEach(src=>{
                html += `<img src="${src}" alt="Year ${year}" class="year-thumb">`;
            });
            html += `</div>`;
        } else {
            html += `<img src="${data.img}" alt="Year ${year}">`;
        }
    }
    if(data.audio) html += `<div style="margin-top:12px"><audio controls src="${data.audio}"></audio></div>`;

    contentDiv.innerHTML = html;
}

/**
 * Render a grouped range of years (start..end) and include a combined media file.
 * Shows the content for the start year first (if available), then the combined video.
 */
function openRange(start, end, combinedSrc){
    const contentDiv = document.getElementById('yearContent');
    if(!contentDiv) return;
    // Only display the combined media for the full range per request.
    let html = `<h2>Years ${start}–${end}</h2>`;
    if(combinedSrc){
        // Detect whether the combined source is audio or video by extension
        const isAudio = /\.(m4a|mp3|wav|aac|ogg)$/i.test(combinedSrc);
        if(isAudio){
            html += `<div class="range-combined-audio"><audio id="combinedRangeAudio" controls preload="auto" src="${combinedSrc}"></audio></div>`;
        } else {
            html += `<div class="year-video-wrap"><video controls class="year-video" src="${combinedSrc}"></video></div>`;
        }
    } else {
        html += `<p>No combined media available for this range.</p>`;
    }
    contentDiv.innerHTML = html;

    // If we rendered a combined audio element, try to play it and add fallbacks
    try{
        const combinedEl = document.getElementById('combinedRangeAudio');
        if(combinedEl){
            // Pause any other audios in the view
            const otherAudios = contentDiv.querySelectorAll('audio');
            otherAudios.forEach(a=>{ if(a !== combinedEl) a.pause(); });

            combinedEl.load();
            combinedEl.play().catch(()=>{
                console.warn('Combined range audio play was blocked; showing play button fallback.');
                // fallback button
                if(!document.getElementById('combinedRangePlayBtn')){
                    const wrapper = combinedEl.parentElement || contentDiv;
                    const btn = document.createElement('button');
                    btn.id = 'combinedRangePlayBtn';
                    btn.type = 'button';
                    btn.textContent = 'Play combined audio';
                    btn.style.margin = '12px auto';
                    btn.style.display = 'block';
                    btn.style.padding = '10px 14px';
                    btn.style.borderRadius = '8px';
                    btn.style.border = 'none';
                    btn.style.background = 'linear-gradient(90deg,#4f46e5,#7c3aed)';
                    btn.style.color = '#fff';
                    btn.style.cursor = 'pointer';
                    btn.onclick = async function(){
                        try{
                            await combinedEl.play();
                            btn.remove();
                            const err = document.getElementById('combinedRangeAudioError');
                            if(err) err.remove();
                        }catch(err){
                            console.error('Play failed after user click:', err);
                            if(!document.getElementById('combinedRangeAudioError')){
                                const msg = document.createElement('div');
                                msg.id = 'combinedRangeAudioError';
                                msg.textContent = 'Playback failed. Check DevTools Network tab to confirm the file exists.';
                                msg.style.color = '#b00020';
                                msg.style.margin = '8px 0';
                                wrapper.appendChild(msg);
                            }
                        }
                    };
                    (combinedEl.parentElement || contentDiv).appendChild(btn);
                }
            });

            combinedEl.addEventListener('error', (ev)=>{
                console.error('Combined range audio failed to load:', combinedEl.src, ev);
                if(!document.getElementById('combinedRangeAudioError')){
                    const msg = document.createElement('div');
                    msg.id = 'combinedRangeAudioError';
                    msg.textContent = 'Could not load combined audio (file missing or wrong filename).';
                    msg.style.color = '#b00020';
                    msg.style.margin = '8px 0';
                    contentDiv.querySelector('.range-combined-audio')?.appendChild(msg);
                }
                if(!document.getElementById('combinedRangePlayBtn')){
                    const btn = document.createElement('button');
                    btn.id = 'combinedRangePlayBtn';
                    btn.type = 'button';
                    btn.textContent = 'Attempt play';
                    btn.onclick = ()=>combinedEl.play().catch(()=>{});
                    contentDiv.querySelector('.range-combined-audio')?.appendChild(btn);
                }
            });
        }
    }catch(e){
        console.error('Error handling combined range audio:', e);
    }

    // If this is the Years 21-25 range, also show the additional 'After 25' audio clip if present
    if(start === 21 && end === 25){
        try{
            const afterSrc = 'assets/After 25.m4a';
            const wrapper = contentDiv.querySelector('.range-combined-audio') || contentDiv;
            // create a separate block for the 'After' audio
            const afterDiv = document.createElement('div');
            afterDiv.className = 'range-combined-audio after-clip';
            const afterAudio = document.createElement('audio');
            afterAudio.id = 'after25Audio';
            afterAudio.controls = true;
            afterAudio.preload = 'auto';
            afterAudio.src = afterSrc;
            afterDiv.appendChild(afterAudio);
            wrapper.parentNode.insertBefore(afterDiv, wrapper.nextSibling);

            // Try to play (user gesture required; fallback provided)
            afterAudio.load();
            afterAudio.play().catch(()=>{
                console.warn('After 25 audio autoplay blocked; showing play button.');
                if(!document.getElementById('after25PlayBtn')){
                    const btn = document.createElement('button');
                    btn.id = 'after25PlayBtn';
                    btn.type = 'button';
                    btn.textContent = 'Play After 25 audio';
                    btn.style.margin = '8px auto';
                    btn.style.display = 'block';
                    btn.style.padding = '8px 12px';
                    btn.style.borderRadius = '8px';
                    btn.style.border = 'none';
                    btn.style.background = 'linear-gradient(90deg,#06b6d4,#0ea5e9)';
                    btn.style.color = '#fff';
                    btn.style.cursor = 'pointer';
                    btn.onclick = async function(){
                        try{
                            await afterAudio.play();
                            btn.remove();
                            const err = document.getElementById('after25AudioError');
                            if(err) err.remove();
                        }catch(err){
                            console.error('After audio play failed after click:', err);
                            if(!document.getElementById('after25AudioError')){
                                const msg = document.createElement('div');
                                msg.id = 'after25AudioError';
                                msg.textContent = 'Playback failed. Check DevTools Network tab to confirm the file exists.';
                                msg.style.color = '#b00020';
                                msg.style.margin = '8px 0';
                                wrapper.appendChild(msg);
                            }
                        }
                    };
                    afterDiv.appendChild(btn);
                }
            });

            afterAudio.addEventListener('error', (ev)=>{
                console.error('After 25 audio failed to load:', afterAudio.src, ev);
                if(!document.getElementById('after25AudioError')){
                    const msg = document.createElement('div');
                    msg.id = 'after25AudioError';
                    msg.textContent = 'Could not load After 25 audio (file missing or wrong filename).';
                    msg.style.color = '#b00020';
                    msg.style.margin = '8px 0';
                    afterDiv.appendChild(msg);
                }
            });
        }catch(e){
            console.error('Error while attaching After 25 audio:', e);
        }
    }

    // Also try to find and show a matching combined video for the same range,
    // since the user wants both audio and video available in the range view.
    (async function tryAttachCombinedVideo(){
        try{
            // build candidate video URLs from the provided combinedSrc
            if(!combinedSrc) return;
            const base = combinedSrc.replace(/\.[^/.]+$/, '');
            const candidates = [];
            // candidate 1: same basename + .mp4 (handles Year11-20.m4a -> Year11-20.mp4)
            candidates.push(base + '.mp4');
            // candidate 2: insert a space after "Year" if it's missing (handles Year11-20 -> Year 11-20)
            candidates.push(base.replace(/Year\s*/i, 'Year ') + '.mp4');
            // candidate 3: remove a space after "Year" if present (handles "Year 11-20" -> "Year11-20")
            candidates.push(base.replace(/Year\s+/i, 'Year') + '.mp4');

            // dedupe candidates preserving order
            const seen = new Set();
            const finalCandidates = candidates.filter(c=>{ if(seen.has(c)) return false; seen.add(c); return true; });

            for(const url of finalCandidates){
                try{
                    const resp = await fetch(url, {method: 'HEAD'});
                    if(resp && resp.ok){
                        // found a video — insert it just after the combined audio element
                        const container = contentDiv.querySelector('.range-combined-audio') || contentDiv;
                        const vidWrap = document.createElement('div');
                        vidWrap.className = 'year-video-wrap';
                        const video = document.createElement('video');
                        video.controls = true;
                        video.className = 'year-video';
                        video.src = url;
                        vidWrap.appendChild(video);
                        // place video after the audio container
                        if(container.nextSibling) container.parentNode.insertBefore(vidWrap, container.nextSibling);
                        else container.appendChild(vidWrap);
                        console.log('Attached combined video for range from', url);
                        break;
                    }
                }catch(err){
                    // HEAD might be blocked on some servers; try a lightweight GET as fallback
                    try{
                        const resp2 = await fetch(url, {method: 'GET', headers: {Range: 'bytes=0-0'}});
                        if(resp2 && (resp2.status === 206 || resp2.status === 200)){
                            const container = contentDiv.querySelector('.range-combined-audio') || contentDiv;
                            const vidWrap = document.createElement('div');
                            vidWrap.className = 'year-video-wrap';
                            const video = document.createElement('video');
                            video.controls = true;
                            video.className = 'year-video';
                            video.src = url;
                            vidWrap.appendChild(video);
                            if(container.nextSibling) container.parentNode.insertBefore(vidWrap, container.nextSibling);
                            else container.appendChild(vidWrap);
                            console.log('Attached combined video for range (GET fallback) from', url);
                            break;
                        }
                    }catch(e2){
                        // ignore and try next candidate
                    }
                }
            }
        }catch(e){
            console.error('Error while trying to attach combined video for range:', e);
        }
    })();
}

/**
 * Render all years from start..end, showing each year's text/media/audio.
 * Used for the Years 1-10 grouped button.
 */
function openRangeAll(start, end){
    const contentDiv = document.getElementById('yearContent');
    if(!contentDiv) return;

    let html = `<h2>Years ${start}–${end}</h2>`;
    // Combined audio for Years 1-10 (single clip)
    // Use the actual filename present in the assets folder. Some files include a space
    // (e.g. "Year 1-10.m4a"). Try the most likely candidate first.
    const combinedAudio = 'assets/Year 1-10.m4a';
    html += `<div class="range-combined-audio"><audio id="combinedAudio" controls preload="auto" src="${combinedAudio}"></audio></div>`;

    for(let y = start; y <= end; y++){
        const data = yearData[y];
        html += `<section class="range-year"><h3>Year ${y}</h3>`;
        if(!data){
            html += `<p>Content coming soon.</p></section>`;
            continue;
        }

        if(data.text) html += `<p>${data.text}</p>`;

        if(data.video){
            html += `<div class="year-video-wrap"><video controls class="year-video" src="${data.video}"></video></div>`;
        } else if(data.img){
            if(Array.isArray(data.img)){
                html += `<div class="year-gallery">`;
                data.img.forEach(src=> html += `<img src="${src}" alt="Year ${y}" class="year-thumb">`);
                html += `</div>`;
            } else {
                html += `<img src="${data.img}" alt="Year ${y}">`;
            }
        }

        if(data.audio) html += `<div style="margin-top:12px"><audio controls src="${data.audio}"></audio></div>`;
        html += `</section>`;
    }

    contentDiv.innerHTML = html;

    // After rendering, attempt to play the combined audio and pause any other audio players
    const combinedEl = document.getElementById('combinedAudio');
    if(combinedEl){
        // Pause other audio elements in the view to avoid overlap
        const otherAudios = contentDiv.querySelectorAll('audio');
        otherAudios.forEach(a=>{ if(a !== combinedEl) a.pause(); });

        combinedEl.load();

        // If the audio cannot be played immediately, show a visible user-action play button.
        combinedEl.play().catch(()=>{
            console.warn('Combined audio play was blocked by browser autoplay policy or failed to start.');
            createCombinedPlayButton(combinedEl, contentDiv);
        });

        // If the audio resource fails to load (404, bad filename), show an informative message and the play button.
        combinedEl.addEventListener('error', (ev)=>{
            console.error('Combined audio failed to load:', combinedEl.src, ev);
            // show a small error message in the UI
            try{
                const errNoticeId = 'combinedAudioError';
                if(!document.getElementById(errNoticeId)){
                    const msg = document.createElement('div');
                    msg.id = errNoticeId;
                    msg.textContent = 'Could not load combined audio (file missing or wrong filename).';
                    msg.style.color = '#b00020';
                    msg.style.margin = '8px 0';
                    contentDiv.querySelector('.range-combined-audio')?.appendChild(msg);
                }
                createCombinedPlayButton(combinedEl, contentDiv);
            }catch(e){
                console.error('Error while showing combined audio load error:', e);
            }
        });
    }

    // Helper to create a visible play button (idempotent)
    function createCombinedPlayButton(combinedEl, contentDiv){
        try{
            const wrapper = combinedEl.parentElement || contentDiv;
            if (!document.getElementById('combinedPlayBtn')){
                const btn = document.createElement('button');
                btn.id = 'combinedPlayBtn';
                btn.type = 'button';
                btn.textContent = 'Play combined audio';
                btn.style.margin = '12px auto';
                btn.style.display = 'block';
                btn.style.padding = '10px 14px';
                btn.style.borderRadius = '8px';
                btn.style.border = 'none';
                btn.style.background = 'linear-gradient(90deg,#ff6b6b,#ff8a80)';
                btn.style.color = '#fff';
                btn.style.cursor = 'pointer';
                btn.onclick = async function(){
                    try{
                        await combinedEl.play();
                        btn.remove();
                        const err = document.getElementById('combinedAudioError');
                        if(err) err.remove();
                    }catch(err){
                        console.error('Play failed after user click:', err);
                        // If play fails because the file is missing, keep the button and show error.
                        if(!document.getElementById('combinedAudioError')){
                            const msg = document.createElement('div');
                            msg.id = 'combinedAudioError';
                            msg.textContent = 'Playback failed. Check DevTools Network tab to confirm the file exists.';
                            msg.style.color = '#b00020';
                            msg.style.margin = '8px 0';
                            wrapper.appendChild(msg);
                        }
                    }
                };
                wrapper.appendChild(btn);
            }
        }catch(e){
            console.error('Could not create play button:', e);
        }
    }
}

// Basic UI behaviors: mobile nav toggle and smooth scrolling
document.addEventListener('DOMContentLoaded', ()=>{
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');

    if(navToggle && siteNav){
        navToggle.addEventListener('click', ()=>{
            const isHidden = window.getComputedStyle(siteNav).display === 'none';
            siteNav.style.display = isHidden ? 'flex' : 'none';
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click', (e)=>{
            const href = a.getAttribute('href');
            if(!href || href === '#') return;
            const target = document.querySelector(href);
            if(target){
                e.preventDefault();
                target.scrollIntoView({behavior:'smooth', block:'start'});
                // close mobile nav after click
                if(window.innerWidth <= 720 && siteNav) siteNav.style.display = 'none';
            }
        });
    });

    // Reveal timeline only when the Explore button is clicked
    const exploreBtn = document.getElementById('exploreBtn');
    const timelineSection = document.getElementById('timeline');
    if(exploreBtn && timelineSection){
        exploreBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            // unhide timeline and then scroll to it
            timelineSection.classList.remove('hidden');
            timelineSection.scrollIntoView({behavior:'smooth', block:'start'});
        });
    }
});

// --- Khushi special view ---
async function openKhushi(){
    const contentDiv = document.getElementById('yearContent');
    if(!contentDiv) return;

    let html = `<h2>Khushi</h2><p>Special media for Khushi.</p>`;
    html += `<div class="khushi-media"></div>`;
    contentDiv.innerHTML = html;

    const container = contentDiv.querySelector('.khushi-media');

    // Candidate filenames for video and audio (try common variants)
    const videoCandidates = ['assets/Khushi.MOV','assets/Khushi.mov','assets/Khushi.mp4','assets/Khushi.MP4'];
    const audioCandidates = ['assets/Khushi.m4a','assets/Khushi.mp4a','assets/Khushi.mp3','assets/Khushi.M4A'];

    // helper to probe existence (HEAD then tiny GET fallback)
    async function exists(url){
        try{
            const resp = await fetch(url, {method:'HEAD'});
            if(resp && resp.ok) return true;
        }catch(e){
            // HEAD might be blocked; try small GET
            try{
                const r2 = await fetch(url, {method:'GET', headers:{Range:'bytes=0-0'}});
                if(r2 && (r2.status === 206 || r2.status === 200)) return true;
            }catch(e2){/* ignore */}
        }
        return false;
    }

    // attach first available video
    for(const v of videoCandidates){
        try{
            if(await exists(v)){
                const wrap = document.createElement('div');
                wrap.className = 'year-video-wrap';
                const video = document.createElement('video');
                video.className = 'year-video';
                video.controls = true;
                video.src = v;
                wrap.appendChild(video);
                container.appendChild(wrap);
                console.log('Khushi video attached:', v);
                break;
            }
        }catch(e){console.error('Error probing khushi video', e)}
    }

    // attach first available audio
    for(const a of audioCandidates){
        try{
            if(await exists(a)){
                const audWrap = document.createElement('div');
                audWrap.className = 'range-combined-audio';
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.preload = 'auto';
                audio.src = a;
                audio.id = 'khushiAudio';
                audWrap.appendChild(audio);
                container.appendChild(audWrap);

                // autoplay attempt and fallback
                audio.load();
                audio.play().catch(()=>{
                    console.warn('Khushi audio autoplay blocked; showing play button.');
                    if(!document.getElementById('khushiPlayBtn')){
                        const btn = document.createElement('button');
                        btn.id = 'khushiPlayBtn';
                        btn.type = 'button';
                        btn.textContent = 'Play Khushi audio';
                        btn.style.margin = '10px auto';
                        btn.style.display = 'block';
                        btn.style.padding = '8px 12px';
                        btn.style.borderRadius = '8px';
                        btn.style.border = 'none';
                        btn.style.background = 'linear-gradient(90deg,#f97316,#fb923c)';
                        btn.style.color = '#fff';
                        btn.style.cursor = 'pointer';
                        btn.onclick = async ()=>{
                            try{ await audio.play(); btn.remove(); }catch(err){ console.error('Khushi play failed', err); }
                        };
                        audWrap.appendChild(btn);
                    }
                });

                audio.addEventListener('error', ()=>{
                    console.error('Khushi audio failed to load:', audio.src);
                    if(!document.getElementById('khushiAudioError')){
                        const msg = document.createElement('div');
                        msg.id = 'khushiAudioError';
                        msg.textContent = 'Could not load Khushi audio.';
                        msg.style.color = '#b00020';
                        msg.style.margin = '8px 0';
                        audWrap.appendChild(msg);
                    }
                });

                console.log('Khushi audio attached:', a);
                break;
            }
        }catch(e){console.error('Error probing khushi audio', e)}
    }

    // If neither video nor audio was attached, show a notice
    if(container.children.length === 0){
        const note = document.createElement('div');
        note.textContent = 'No Khushi media found in the `assets/` folder.';
        note.style.color = '#b00020';
        container.appendChild(note);
    }
}

// --- Sonara special view ---
async function openSonara(){
    const contentDiv = document.getElementById('yearContent');
    if(!contentDiv) return;

    let html = `<h2>Sonara</h2><p>Special media for Sonara.</p>`;
    html += `<div class="sonara-media"></div>`;
    contentDiv.innerHTML = html;

    const container = contentDiv.querySelector('.sonara-media');

    // Candidate filenames for video and audio
    const videoCandidates = ['assets/Sonara.mp4','assets/Sonara.MP4','assets/Sonara.Mov','assets/Sonara.MOV'];
    const audioCandidates = ['assets/Sonara.Mp4a','assets/Sonara.m4a','assets/Sonara.MP4A','assets/Sonara.mp3'];

    async function exists(url){
        try{
            const resp = await fetch(url, {method:'HEAD'});
            if(resp && resp.ok) return true;
        }catch(e){
            try{
                const r2 = await fetch(url, {method:'GET', headers:{Range:'bytes=0-0'}});
                if(r2 && (r2.status === 206 || r2.status === 200)) return true;
            }catch(e2){/* ignore */}
        }
        return false;
    }

    // attach first available video
    for(const v of videoCandidates){
        try{
            if(await exists(v)){
                const wrap = document.createElement('div');
                wrap.className = 'year-video-wrap';
                const video = document.createElement('video');
                video.className = 'year-video';
                video.controls = true;
                video.src = v;
                wrap.appendChild(video);
                container.appendChild(wrap);
                console.log('Sonara video attached:', v);
                break;
            }
        }catch(e){console.error('Error probing Sonara video', e)}
    }

    // attach first available audio
    for(const a of audioCandidates){
        try{
            if(await exists(a)){
                const audWrap = document.createElement('div');
                audWrap.className = 'range-combined-audio';
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.preload = 'auto';
                audio.src = a;
                audio.id = 'sonaraAudio';
                audWrap.appendChild(audio);
                container.appendChild(audWrap);

                // autoplay attempt and fallback
                audio.load();
                audio.play().catch(()=>{
                    console.warn('Sonara audio autoplay blocked; showing play button.');
                    if(!document.getElementById('sonaraPlayBtn')){
                        const btn = document.createElement('button');
                        btn.id = 'sonaraPlayBtn';
                        btn.type = 'button';
                        btn.textContent = 'Play Sonara audio';
                        btn.style.margin = '10px auto';
                        btn.style.display = 'block';
                        btn.style.padding = '8px 12px';
                        btn.style.borderRadius = '8px';
                        btn.style.border = 'none';
                        btn.style.background = 'linear-gradient(90deg,#06b6d4,#0ea5e9)';
                        btn.style.color = '#fff';
                        btn.style.cursor = 'pointer';
                        btn.onclick = async ()=>{
                            try{ await audio.play(); btn.remove(); }catch(err){ console.error('Sonara play failed', err); }
                        };
                        audWrap.appendChild(btn);
                    }
                });

                audio.addEventListener('error', ()=>{
                    console.error('Sonara audio failed to load:', audio.src);
                    if(!document.getElementById('sonaraAudioError')){
                        const msg = document.createElement('div');
                        msg.id = 'sonaraAudioError';
                        msg.textContent = 'Could not load Sonara audio.';
                        msg.style.color = '#b00020';
                        msg.style.margin = '8px 0';
                        audWrap.appendChild(msg);
                    }
                });

                console.log('Sonara audio attached:', a);
                break;
            }
        }catch(e){console.error('Error probing Sonara audio', e)}
    }

    if(container.children.length === 0){
        const note = document.createElement('div');
        note.textContent = 'No Sonara media found in the `assets/` folder.';
        note.style.color = '#b00020';
        container.appendChild(note);
    }
}
