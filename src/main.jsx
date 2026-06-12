import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  Clapperboard,
  Coffee,
  Heart,
  MapPin,
  Send,
  Sparkles,
  Utensils,
} from "lucide-react";
import VueCalendarBridge from "./components/VueCalendarBridge.jsx";
import heroImage from "./assets/date-collage.png";
import rejectionImage from "./assets/faye-raar.jpg";
import victoryImage from "./assets/arjen-absolute-cinema.png";
import "./styles.css";

const noScreens = [
  "Ben je echt heel zeker? Zo ja, begrijp ik de keuze :(",
  "Ik zie het al, 2x perongeluk op nee geklikt, silly you! Kan de beste overkomen.",
  "Oke 3x nee, auwtch :(",
  "Laatste kans? Nee wacht, ik heb nog vragen.",
  "Stel je voor dat dit later een goed verhaal wordt.",
  "Als er iets is, kan je het ook gewoon zeggen, ipv continu op nee te klikken hoor!",
  "Ik noteer: nieuw kapsel is lelijk.",
  "Wat als Arjen zijn beste outfit aandoet?",
  "Wat als we vis gaan eten (ja vis)",
  "Wat als het stiekem mijn idee was om continu op nee te doen klikken?",
  "Oke, maar echt echt zeker?",
  "Oke dit is echt de laatste vraag, ge durft echt nie nog eens op nee te klikken. PS: is voor uw eigen bestwil",
];

const availability = [
  {
    id: "za-13",
    day: "Zaterdag",
    date: "13/06/2026",
    time: "Hele dag",
    title: "Vrij",
    note: "Altijd vrij, dus kies maar een goed moment.",
    status: "Vrij",
  },
  {
    id: "zo-14",
    day: "Zondag",
    date: "14/06/2026",
    time: "Hele dag",
    title: "Vrij",
    note: "Altijd vrij, rustig dagje voor een plannetje.",
    status: "Vrij",
  },
  {
    id: "ma-15",
    day: "Maandag",
    date: "15/06/2026",
    time: "Hele dag",
    title: "Vrij",
    note: "Altijd vrij, van namiddag tot avond kan zeker.",
    status: "Vrij",
  },
  {
    id: "di-16",
    day: "Dinsdag",
    date: "16/06/2026",
    time: "Namiddag en avond",
    title: "Voormiddag bezet",
    note: "In de voormiddag presentatie, daarna vrij.",
    status: "Namiddag vrij",
  },
  {
    id: "wo-17",
    day: "Woensdag",
    date: "17/06/2026",
    time: "Overdag",
    title: "Avond bezet",
    note: "Woensdagavond uitgaan, voor de rest vrij.",
    status: "Rest vrij",
  },
  {
    id: "do-18",
    day: "Donderdag",
    date: "18/06/2026",
    time: "Hele dag",
    title: "Vrij",
    note: "Altijd vrij, makkelijk te combineren.",
    status: "Vrij",
  },
  {
    id: "vr-19",
    day: "Vrijdag",
    date: "19/06/2026",
    time: "Hele dag",
    title: "Vrij",
    note: "Altijd vrij, perfect voor een langer plannetje.",
    status: "Vrij",
  },
];

const activityOptions = [
  { id: "arjen", label: "Arjen mag kiezen", icon: Sparkles },
  { id: "dinner", label: "Uit eten", icon: Utensils },
  { id: "movie", label: "Film kijken", icon: Clapperboard },
  { id: "drinks", label: "Drankje doen", icon: Coffee },
  { id: "walk", label: "Wandeling", icon: MapPin },
];

const detailQuestions = {
  dinner: {
    title: "Wat eten we?",
    subtitle: "Kies iets waar je blij van wordt. Meerdere smaken mogen.",
    options: ["Italiaans", "Sushi", "Tapas", "Burgers", "Mexicaans", "Verrassing"],
  },
  movie: {
    title: "Welke filmrichting?",
    subtitle: "Geen stress, echt goed zal de film wel niet zijn",
    options: ["Romcom", "Thriller", "Comedy", "Actie", "Disney/Pixar", "Laat Arjen trailers sturen"],
  },
  drinks: {
    title: "Wat drinken we?",
    subtitle: "Zuipen we ons lam? Of chillen we ons?",
    options: ["Cocktails", "Mocktails", "Koffie", "Wijnbar", "Speciaalbier", "Thee en dessert"],
  },
  walk: {
    title: "Waar wandelen we?",
    subtitle: "Met genoeg ruimte om leuk te praten.",
    options: ["Park", "Stad", "Langs het water", "Zonsondergang", "Met ijsje erbij", "Verrassing"],
  },
};

const arjenEmail = "arjen.coenegracht123@hotmail.com";

function App() {
  const [stage, setStage] = useState("intro");
  const [noStep, setNoStep] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [activities, setActivities] = useState([]);
  const [details, setDetails] = useState({});
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  const selectedActivityLabels = useMemo(
    () => activityOptions.filter((item) => activities.includes(item.id)).map((item) => item.label),
    [activities],
  );

  const selectedMomentText = useMemo(
    () =>
      selectedSlots.length
        ? selectedSlots.map((slot) => `${slot.day} ${slot.date}`).join(", ")
        : "Arjen regelt het",
    [selectedSlots],
  );

  const planMessage = useMemo(() => {
    const lines = [
      "Mijn date-plannetje:",
      `Moment: ${selectedMomentText}`,
      `Vanaf: ${startTime || "Nog te kiezen"}`,
    ];

    if (selectedSlots.length >= 2) {
      lines.push("Sleepover optie: meerdere dagen geselecteerd");
    }

    lines.push(`Activiteit: ${selectedActivityLabels.join(", ") || "Arjen mag kiezen"}`);

    Object.entries(details).forEach(([key, values]) => {
      lines.push(`${detailQuestions[key].title} ${values.join(", ")}`);
    });

    return lines.join("\n");
  }, [details, selectedActivityLabels, selectedMomentText, selectedSlots.length, startTime]);

  const sendPlan = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Het plannetje",
        text: planMessage,
      });
      return;
    }

    await navigator.clipboard.writeText(planMessage);
    alert("Het plannetje is gekopieerd. Stuur het nu naar Arjen.");
  };

  const chooseNo = () => {
    setStage("no-loop");
    setNoStep(0);
  };

  const chooseNoAgain = () => {
    if (noStep >= noScreens.length - 1) {
      setShowRejectionModal(true);
      return;
    }

    setNoStep((current) => current + 1);
  };

  const toggleActivity = (id) => {
    if (id === "arjen") {
      setActivities(["arjen"]);
      setDetails({});
      return;
    }

    setActivities((current) => {
      const withoutArjen = current.filter((item) => item !== "arjen");
      return withoutArjen.includes(id)
        ? withoutArjen.filter((item) => item !== id)
        : [...withoutArjen, id];
    });
  };

  const toggleDetail = (activityId, value) => {
    setDetails((current) => {
      const active = current[activityId] || [];
      const next = active.includes(value) ? active.filter((item) => item !== value) : [...active, value];
      return { ...current, [activityId]: next };
    });
  };

  const toggleSlot = (slot) => {
    setSelectedSlots((current) =>
      current.some((item) => item.id === slot.id)
        ? current.filter((item) => item.id !== slot.id)
        : [...current, slot],
    );
  };

  const detailActivities = activities.filter((activity) => detailQuestions[activity]);
  const canFinishDetails = detailActivities.every((activity) => details[activity]?.length);

  return (
    <main className="app-shell">
      <img className="hero-art" src={heroImage} alt="" />
      <div className="aurora" />

      <section className="experience" aria-live="polite">
        <header className="topbar">
          <div className="brand-mark">
            <Heart size={18} fill="currentColor" />
          </div>
          <div className="progress-dots" aria-label="Voortgang">
            {["intro", "calendar", "time", "activities", "details", "done"].map((item) => (
              <span key={item} className={stage === item ? "active" : ""} />
            ))}
          </div>
        </header>

        {stage === "intro" && (
          <section className="panel intro-panel">
            <p className="eyebrow">Een officiele uitnodiging</p>
            <h1>Zin om met Arjen op date te gaan?</h1>
            <p className="lead">
              Een simpele vraag. Als het niet is, is het niet :), Lowkey daag ik u uit om continu op nee te duwen, of toch niet?
            </p>
            <div className="choice-row">
              <button className="primary-btn" onClick={() => setStage("calendar")}>
                <Check size={20} />
                Ja, leuk
              </button>
              <button className="ghost-btn evasive" onClick={chooseNo}>
                Nee
              </button>
            </div>
          </section>
        )}

        {stage === "no-loop" && (
          <section className="panel no-panel">
            <p className="eyebrow">Controle {noStep + 1} van {noScreens.length}</p>
            <h2>{noScreens[noStep]}</h2>
            <div className="meter">
              <span style={{ width: `${((noStep + 1) / noScreens.length) * 100}%` }} />
            </div>
            <div className="choice-row">
              <button className="primary-btn" onClick={() => setStage("calendar")}>
                <Heart size={20} fill="currentColor" />
                Oké dan, ja
              </button>
              <button
                className="ghost-btn"
                onClick={chooseNoAgain}
              >
                Nog steeds nee
              </button>
            </div>
          </section>
        )}

        {stage === "calendar" && (
          <section className="wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Stap 1</p>
                <h2>Kies een moment</h2>
                <p className="hint">
                  Je mag meerdere dagen selecteren. Indien je een sleepover wilt, selecteer je 2 of meer dagen achter elkaar.
                </p>
              </div>
              <CalendarDays size={28} />
            </div>
            <VueCalendarBridge
              slots={availability}
              selectedIds={selectedSlots.map((slot) => slot.id)}
              onSelect={toggleSlot}
            />
            <div className="footer-actions">
              <button className="ghost-btn compact" onClick={() => setStage("intro")}>
                <ChevronLeft size={18} />
                Terug
              </button>
              <button className="primary-btn compact" disabled={!selectedSlots.length} onClick={() => setStage("time")}>
                Verder
              </button>
            </div>
          </section>
        )}

        {stage === "time" && (
          <section className="wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Stap 2</p>
                <h2>Vanaf hoe laat kan je?</h2>
                <p className="hint">
                  Kies het uur waarop je ongeveer vrij bent. Mag ook gewoon een richtuur zijn.
                </p>
              </div>
            </div>
            <label className="time-picker">
              <span>Startuur</span>
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </label>
            <div className="quick-times" aria-label="Snelle uren">
              {["12:00", "14:00", "16:00", "18:00", "20:00"].map((time) => (
                <button
                  key={time}
                  className={startTime === time ? "pill selected" : "pill"}
                  onClick={() => setStartTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="footer-actions">
              <button className="ghost-btn compact" onClick={() => setStage("calendar")}>
                <ChevronLeft size={18} />
                Terug
              </button>
              <button className="primary-btn compact" disabled={!startTime} onClick={() => setStage("activities")}>
                Verder
              </button>
            </div>
          </section>
        )}

        {stage === "activities" && (
          <section className="wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Stap 3</p>
                <h2>Wat gaan we doen?</h2>
                <p className="hint">Je mag meerdere dingen combineren. Eten + film? Drankje + wandeling? Sterk plan.</p>
              </div>
            </div>
            <div className="activity-grid">
              {activityOptions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`activity-tile ${activities.includes(id) ? "selected" : ""}`}
                  onClick={() => toggleActivity(id)}
                >
                  <Icon size={24} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="footer-actions">
              <button className="ghost-btn compact" onClick={() => setStage("time")}>
                <ChevronLeft size={18} />
                Terug
              </button>
              <button
                className="primary-btn compact"
                disabled={!activities.length}
                onClick={() => setStage(activities.includes("arjen") ? "done" : "details")}
              >
                Verder
              </button>
            </div>
          </section>
        )}

        {stage === "details" && (
          <section className="wide-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Stap 4</p>
                <h2>Maak het plannetje af</h2>
              </div>
            </div>
            <div className="detail-stack">
              {detailActivities.map((activity) => (
                <div className="detail-block" key={activity}>
                  <h3>{detailQuestions[activity].title}</h3>
                  <p>{detailQuestions[activity].subtitle}</p>
                  <div className="pill-grid">
                    {detailQuestions[activity].options.map((option) => (
                      <button
                        key={option}
                        className={details[activity]?.includes(option) ? "pill selected" : "pill"}
                        onClick={() => toggleDetail(activity, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="footer-actions">
              <button className="ghost-btn compact" onClick={() => setStage("activities")}>
                <ChevronLeft size={18} />
                Terug
              </button>
              <button className="primary-btn compact" disabled={!canFinishDetails} onClick={() => setStage("done")}>
                Klaar
              </button>
            </div>
          </section>
        )}

        {stage === "done" && (
          <section className="panel done-panel">
            <p className="eyebrow">Verstuurbaar bewijs</p>
            <h2>Het plannetje staat bijna vast.</h2>
            <div className="summary">
              <p><strong>Moment:</strong> {selectedMomentText}</p>
              <p><strong>Vanaf:</strong> {startTime || "Nog te kiezen"}</p>
              {selectedSlots.length >= 2 && (
                <p><strong>Sleepover optie:</strong> meerdere dagen geselecteerd.</p>
              )}
              <p><strong>Activiteit:</strong> {selectedActivityLabels.join(", ") || "Arjen mag kiezen"}</p>
              {Object.entries(details).map(([key, values]) => (
                <p key={key}><strong>{detailQuestions[key].title}</strong> {values.join(", ")}</p>
              ))}
            </div>
            <p className="lead small">Screenshot dit en stuur het terug. Arjen zal vermoedelijk heel subtiel blij zijn.</p>
            <div className="send-actions">
              <button className="primary-btn" onClick={sendPlan}>
                <Send size={20} />
                Stuur naar Arjen
              </button>
              <a
                className="ghost-btn link-btn"
                href={`mailto:${arjenEmail}?subject=${encodeURIComponent("Het plannetje")}&body=${encodeURIComponent(planMessage)}`}
              >
                Mail het plannetje
              </a>
              <button className="ghost-btn" onClick={() => navigator.clipboard.writeText(planMessage)}>
                <Check size={20} />
                Kopieer tekst
              </button>
            </div>
          </section>
        )}

        {showRejectionModal && (
          <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="rejection-title">
            <section className="rejection-modal">
              <img src={rejectionImage} alt="Dramatische afwijzing reactie" />
              <p className="eyebrow">Laatste melding</p>
              <h2 id="rejection-title">Dammmnn, de afwijzing is hard.</h2>
              <p>
                Maar nie zo hard als deze foto. Oke, ofwel sluit je de applicatie nu,
                ofwel klik je op de knop ja, want ik heb de nee knop nu weggedaan.
              </p>
              <button
                className="primary-btn"
                onClick={() => {
                  setShowRejectionModal(false);
                  setShowVictoryModal(true);
                }}
              >
                <Heart size={20} fill="currentColor" />
                Ja
              </button>
            </section>
          </div>
        )}

        {showVictoryModal && (
          <div className="modal-backdrop cinema-backdrop" role="dialog" aria-modal="true" aria-labelledby="victory-title">
            <section className="rejection-modal cinema-modal">
              <img src={victoryImage} alt="Arjen absolute cinema" />
              <p className="eyebrow">Plot twist</p>
              <h2 id="victory-title">Het is me toch geluukt.</h2>
              <p>
                Absolute cinema. De ja is binnen, het plannetje leeft, en nu gaan we een datum kiezen.
              </p>
              <button
                className="primary-btn"
                onClick={() => {
                  setShowVictoryModal(false);
                  setStage("calendar");
                }}
              >
                <CalendarDays size={20} />
                Kies een datum
              </button>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
