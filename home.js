document.addEventListener('DOMContentLoaded', function() {
    const daysContainer = document.getElementById('days');
    const monthYear = document.getElementById('monthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementById('closeModal');
    const eventForm = document.getElementById('eventForm');
    const eventTitle = document.getElementById('eventTitle');
    const eventTime = document.getElementById('eventTime');
    let currentDate = new Date();
    let events = {};

    let inactivityTime = function() {
        let time;
        const logout = function() {
            window.location.href = 'index.html'; // Redirige a la página de inicio de sesión
        };

        const resetTimer = function() {
            clearTimeout(time);
            time = setTimeout(logout, 300000);  // 5 minutos en milisegundos
        };

        window.onload = resetTimer;
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;
        document.onclick = resetTimer;
        document.onscroll = resetTimer;
    };

    inactivityTime();

    function renderCalendar() {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        let firstDayIndex = firstDayOfMonth.getDay();
        const lastDayIndex = lastDayOfMonth.getDay();
        const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        const lastDay = lastDayOfMonth.getDate();
        const nextDays = 7 - ((lastDayIndex + 1) % 7);

        // Ajustar el primer día de la semana para que sea lunes
        if (firstDayIndex === 0) {
            firstDayIndex = 6;
        } else {
            firstDayIndex -= 1;
        }

        monthYear.textContent = `${firstDayOfMonth.toLocaleString('es-ES', { month: 'long' })} ${currentDate.getFullYear()}`;

        let days = '';

        for (let x = firstDayIndex; x > 0; x--) {
            days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
        }

        for (let i = 1; i <= lastDay; i++) {
            const event = events[`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`];
            days += `<div class="day" data-day="${i}">${i}${event ? `<br><small>${event.title} at ${event.time}</small>` : ''}</div>`;
        }

        for (let j = 1; j <= nextDays; j++) {
            days += `<div class="next-date">${j}</div>`;
        }

        daysContainer.innerHTML = days;

        document.querySelectorAll('.day').forEach(day => {
            day.addEventListener('click', () => openModal(day.dataset.day));
        });
    }

    function openModal(day) {
        eventModal.style.display = 'block';
        eventForm.dataset.day = day;
        const event = events[`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`];
        if (event) {
            eventTitle.value = event.title;
            eventTime.value = event.time;
        } else {
            eventTitle.value = '';
            eventTime.value = '';
        }
    }

    closeModal.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const day = eventForm.dataset.day;
        events[`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`] = {
            title: eventTitle.value,
            time: eventTime.value
        };
        eventModal.style.display = 'none';
        renderCalendar();
    });

    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    window.addEventListener('click', (e) => {
        if (e.target == eventModal) {
            eventModal.style.display = 'none';
        }
    });

    renderCalendar();
});

document.getElementById('saveBtn').addEventListener('click', function() {
    const content = document.getElementById('txtArea').value;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('openBtn').addEventListener('click', function() {
    document.getElementById('txtFileInput').click();
});

document.getElementById('txtFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('txtArea').value = e.target.result;
        };
        reader.readAsText(file);
    }
});
