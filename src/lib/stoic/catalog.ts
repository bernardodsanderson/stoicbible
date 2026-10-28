import type { AccessType, Motif } from "./types";

export type SeedChapter = {
  slug: string;
  title: string;
  number: number;
  access: AccessType;
  verses: string[];
};

export type SeedBook = {
  slug: string;
  title: string;
  author: string;
  description: string;
  sourceUrl: string;
  motif: Motif;
  tone: number;
  chapters: SeedChapter[];
};

function ch(
  slug: string,
  title: string,
  number: number,
  access: AccessType,
  verses: string[],
): SeedChapter {
  return { slug, title, number, access, verses };
}

export const CATALOG: SeedBook[] = [
  {
    slug: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    description:
      "Private notes of a Roman emperor to himself — a handbook of self-command, mortality, and the work of a rational soul.",
    sourceUrl: "https://en.wikisource.org/wiki/The_Meditations_of_the_Emperor_Marcus_Antoninus",
    motif: "column",
    tone: 0,
    chapters: [
      ch("meditations-book-1", "Book 1", 1, "free", [
        "From my grandfather Verus I learned good morals and the government of my temper.",
        "From the reputation and remembrance of my father, modesty and a manly character.",
        "From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.",
        "From my great-grandfather, not to have frequented public schools, and to have had good teachers at home, and to know that on such things a man should spend liberally.",
        "From my tutor, to be neither of the green nor of the blue party at the games in the Circus, nor a partizan either of the Parmularius or the Scutarius at the gladiators' fights; from him too I learned endurance of labour, and to want little, and to work with my own hands, and not to meddle with other people's affairs, and not to be ready to listen to slander.",
        "From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of daemons and such things; and not to breed quails for fighting, nor to give myself up passionately to such things; and to endure freedom of speech; and to have become intimate with philosophy.",
        "From Rusticus I received the impression that my character required improvement and discipline; and from him I learned not to be led astray to sophistic emulation, nor to writing on speculative matters, nor to delivering little hortatory orations.",
        "From Apollonius I learned freedom of will and undeviating steadiness of purpose; and to look to nothing else, not even for a moment, except to reason; and to be, at all times, the same, in sharp pains, on the occasion of the loss of a child, and in long illness.",
        "From Sextus, a benevolent disposition, and the example of a family governed in a fatherly manner, and the idea of living conformably to nature; and gravity without affectation, and to look carefully after the interests of friends, and to tolerate ignorant persons, and those who form opinions without consideration.",
        "From Alexander the grammarian, to refrain from fault-finding, and not in a reproachful way to chide those who uttered any barbarous or solecistic or strange-sounding expression; but dexterously to introduce the very expression which ought to have been used.",
        "From Fronto I learned to observe what envy, and duplicity, and hypocrisy are in a tyrant, and that generally those among us who are called Patricians are rather deficient in paternal affection.",
        "From Alexander the Platonic, not frequently nor without necessity to say to any one, or to write in a letter, that I have no leisure; nor continually to excuse the neglect of duties required by our relation to those with whom we live, by alleging urgent occupations.",
        "From Catulus, not to be indifferent when a friend finds fault, even if he should find fault without reason, but to try to restore him to his usual disposition; and to be ready to speak well of teachers, as it is reported of Domitius and Athenodotus; and to love my children truly.",
        "From my brother Severus, to love my kin, and to love truth, and to love justice; and through him I learned to know Thrasea, Helvidius, Cato, Dion, Brutus; and from him I received the idea of a polity in which there is the same law for all, a polity administered with regard to equal rights and equal freedom of speech, and the idea of a kingly government which respects most of all the freedom of the governed.",
        "From Maximus I learned self-government, and not to be led aside by anything; and cheerfulness in all circumstances, as well as in illness; and a just admixture in the moral character of sweetness and dignity, and to do what was set before me without complaining.",
        "In my father I observed mildness of temper, and unchangeable resolution in the things which he had determined after due deliberation; and no vainglory in those things which men call honours; and a love of labour and perseverance; and a readiness to listen to those who had anything to propose for the common weal.",
        "To the gods I am indebted for having good grandfathers, good parents, a good sister, good teachers, good associates, good kinsmen and friends, nearly everything good.",
      ]),
      ch("meditations-book-2", "Book 2", 2, "free", [
        "Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil. But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me, not only of the same blood or seed, but that it participates in the same intelligence and the same portion of the divinity, I can neither be injured by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman, nor hate him.",
        "Whatever this is that I am, it is a little flesh and breath, and the ruling part. Throw away thy books; no longer distract thyself: it is not allowed; but as if thou wast now dying, despise the flesh; it is blood and bones and a network, a contexture of nerves, veins, and arteries. See the breath also, what kind of a thing it is, air, and not always the same, but every moment sent out and again sucked in. The third then is the ruling part: consider thus: Thou art an old man; no longer let this be a slave, no longer be pulled by the strings like a puppet to unsocial movements, no longer be either dissatisfied with thy present lot, or shrink from the future.",
        "All that is from the gods is full of Providence. That which is from fortune is not separated from nature or without an interweaving and involution with the things which are ordered by Providence. From thence all things flow; and there is besides necessity, and that which is for the advantage of the whole universe, of which thou art a part.",
        "Remember how long thou hast been putting off these things, and how often thou hast received an opportunity from the gods, and yet dost not use it. Thou must now at last perceive of what universe thou art a part, and of what administrator of the universe thy existence is an efflux, and that a limit of time is fixed for thee, which if thou dost not use for clearing away the clouds from thy mind, it will go and thou wilt go, and it will never return.",
        "Every moment think steadily as a Roman and a man to do what thou hast in hand with perfect and simple dignity, and feeling of affection, and freedom, and justice; and to give thyself relief from all other thoughts. And thou wilt give thyself relief, if thou doest every act of thy life as if it were the last, laying aside all carelessness and passionate aversion from the commands of reason, and all hypocrisy, and self-love, and discontent with the portion which has been given to thee.",
        "How quickly all things disappear, in the universe the bodies themselves, but in time the remembrance of them; what is the nature of all sensible things, and particularly those which attract with the bait of pleasure or terrify by pain, or are noised abroad by vapoury fame; how worthless, and contemptible, and sordid, and perishable, and dead they are.",
        "Nothing is more wretched than a man who traverses everything in a round, and pries into the things beneath the earth, as the poet says, and seeks by conjecture what is in the minds of his neighbours, without perceiving that it is sufficient to attend to the daemon within him, and to reverence it sincerely.",
        "Through not observing what is in the mind of another a man has seldom been seen to be unhappy; but those who do not observe the movements of their own minds must of necessity be unhappy.",
        "This thou must always bear in mind, what is the nature of the whole, and what is my nature, and how this is related to that, and what kind of a part it is of what kind of a whole; and that there is no one who hinders thee from always doing and saying the things which are according to the nature of which thou art a part.",
        "Theophrastus, in his comparison of bad acts — such a comparison as one would make in accordance with the common notions of mankind — says, like a true philosopher, that offences which are committed through desire are more blameable than those which are committed through anger.",
        "Since it is possible that thou mayest depart from life this very moment, regulate every act and thought accordingly. But to go away from among men, if there are gods, is not a thing to be afraid of, for the gods will not involve thee in evil; but if indeed they do not exist, or if they have no concern about human affairs, what is it to me to live in a universe devoid of gods or devoid of Providence?",
        "How all things quickly vanish, the bodies themselves in the universe, but in time the remembrance of them. What is the nature of all sensible things, and particularly those that attract with the bait of pleasure or terrify by pain.",
        "Nothing is evil which is according to nature.",
        "The soul of man does violence to itself, first of all, when it becomes an abscess and, as it were, a tumour on the universe, so far as it can. For to be vexed at anything which happens is a separation of ourselves from nature.",
        "Of human life the time is a point, and the substance is in a flux, and the perception dull, and the composition of the whole body subject to putrefaction, and the soul a whirl, and fortune hard to divine, and fame a thing devoid of judgement.",
      ]),
      ch("meditations-book-3", "Book 3", 3, "free", [
        "We ought to consider not only that our life is daily wasting away and a smaller part of it is left, but another thing also must be taken into the account, that if a man should live longer, it is quite uncertain whether the understanding will still continue sufficient for the comprehension of things.",
        "Do not waste the remainder of thy life in thoughts about others, when thou dost not refer thy thoughts to some object of common utility. For thou losest the opportunity of doing something else when thou hast such thoughts as these.",
        "If thou workest at that which is before thee, following right reason seriously, vigorously, calmly, without allowing anything else to distract thee, but keeping thy divine part pure, as if thou shouldst be bound to give it back immediately; if thou holdest to this, expecting nothing, fearing nothing, but satisfied with thy present activity according to nature, and with heroic truth in every word and sound which thou utterest, thou wilt live happy. And there is no man who is able to prevent this.",
        "They seek for themselves private retiring places, as country villages, the sea-shore, mountains; thou too art wont to desire such things very much. But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself. For nowhere either with more quiet or more freedom from trouble does a man retire than into his own soul.",
        "Labour not unwillingly, nor without regard to the common interest, nor without due consideration, nor with distraction; nor let studied ornament set off thy thoughts, and be not either a man of many words, or busy about too many things.",
        "If thou findest in human life anything better than justice, truth, temperance, fortitude, and, in a word, anything better than thy own mind's self-satisfaction in the things which it enables thee to do according to right reason, and in the condition that is assigned to thee without thy own choice; if, I say, thou seest anything better than this, turn to it with all thy soul, and enjoy that which thou hast found to be the best.",
        "Never value anything as profitable to thyself which shall compel thee to break thy promise, to lose thy self-respect, to hate any man, to suspect, to curse, to act the hypocrite, to desire anything which needs walls and curtains.",
        "Reverence the faculty which produces opinion. On this faculty it entirely depends whether there shall exist in thy ruling part any opinion inconsistent with nature and the constitution of the rational animal.",
        "To the body belong sensations, to the soul appetites, to the intelligence principles; and to receive the impressions of forms by means of appearances belongs even to animals; and to be pulled by the strings of desire belongs both to wild beasts and to men who have made themselves into women.",
        "Body, soul, intelligence: to the body belong sensations, to the soul appetites, to the intelligence principles. To receive the impression of forms by means of the appearances belongs even to animals; and to be pulled by the strings of desire belongs both to wild beasts and to men who have made themselves women.",
        "Throwing away then all things, hold to these few. And further, keep in mind that every man lives only this present time, which is an indivisible point, and that all the rest of his life is either past or it is uncertain.",
        "Nothing is more wretched than a man who is always moving in a circle and pries into things beneath the earth, and seeks by conjecture what is in the minds of his neighbours, and does not perceive that it is sufficient to attend to the daemon within him.",
      ]),
      ch("meditations-book-4", "Book 4", 4, "paid", [
        "That which rules within, when it is according to nature, is so affected with respect to the events which happen, that it always easily adapts itself to that which is and is presented to it.",
        "Let no act be done without a purpose, nor otherwise than according to the perfect principles of art.",
        "Men seek retreats for themselves, houses in the country, sea-shores, and mountains; and thou too art wont to desire such things very much. But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself.",
        "Do not act as if thou wert going to live ten thousand years. Death hangs over thee. While thou livest, while it is in thy power, be good.",
        "How much trouble he avoids who does not look to see what his neighbour says or does or thinks, but only to what he does himself, that it may be just and pure.",
        "He who has a vehement desire for posthumous fame does not consider that every one of those who remember him will himself also die very soon.",
        "Take away thy opinion, and then there is taken away the complaint, 'I have been harmed.' Take away the complaint, 'I have been harmed,' and the harm is taken away.",
        "That which does not make a man worse than he was, also does not make his life worse, nor does it harm him either from without or from within.",
        "The universe is transformation: life is opinion.",
        "If any man is able to convince me and show me that I do not think or act right, I will gladly change; for I seek the truth by which no man was ever injured. But he is injured who abides in his error and ignorance.",
        "I do my duty: other things trouble me not; for they are either things without life, or things without reason, or things that have rambled and know not the way.",
        "As for the things themselves, they have no hold even the slightest on the soul, nor have they access to the soul, nor can they turn or move the soul. The soul turns and moves itself alone.",
        "Let there be a looking forth into the world, as it were, from some high place: herds, armies, husbandry, marriages, divorces, births, deaths, the tumult of the courts, desert places, the various nations of barbarians, feasts, mournings, markets — a mixture of all things, and an order composed of contraries.",
        "Observe constantly that all things take place by change, and accustom thyself to consider that the nature of the Universe loves nothing so much as to change the things which are and to make new things like them.",
        "Everything which happens, happens justly; and if thou observest carefully, thou wilt find it to be so.",
        "Do not have such an opinion of things as he has who does thee wrong, or such as he wishes thee to have, but look at them as they are in truth.",
        "A cucumber is bitter. Throw it away. There are briars in the road. Turn aside from them. This is enough. Do not add, And why were such things made in the world?",
      ]),
      ch("meditations-book-5", "Book 5", 5, "paid", [
        "In the morning when thou risest unwillingly, let this thought be present — I am rising to the work of a human being. Why then am I dissatisfied if I am going to do the things for which I exist and for which I was brought into the world?",
        "How easy it is to repel and to wipe away every impression which is troublesome or unsuitable, and immediately to be in all tranquillity.",
        "Judge every word and deed which are according to nature to be fit for thee; and be not diverted by the blame which follows from any people, nor by their words, but if a thing is good to be done or said, do not consider it unworthy of thee.",
        "I am composed of the formal and the material; and neither of them will perish into non-existence, as neither of them came into existence out of non-existence. Every part of me then will be reduced by change into some part of the universe, and that again will change into another part of the universe, and so on forever.",
        "The best way of avenging thyself is not to become like the wrong doer.",
        "If a thing is difficult to be accomplished by thyself, do not think that it is impossible for man: but if anything is possible for man and conformable to his nature, think that this can be attained by thyself too.",
        "In one respect man is the nearest thing to me, so far as I must do good to men and endure them. But in so far as some men make themselves obstacles to my proper acts, man becomes to me one of the things which are indifferent, no less than the sun or wind or a wild beast.",
        "We live only for an instant. Our lives are a passing moment; our fate is inscrutable; our fame is dubious. In a word, all objects of the body are as a stream, all of the soul as a dream and vapour; life is a warfare and a stranger's sojourn, and after-fame is oblivion.",
        "What then is that which is able to conduct a man? One thing and only one, philosophy. Now this consists in keeping the daemon within a man free from violence and unharmed, superior to pains and pleasures, doing nothing without a purpose, nor yet falsely and with hypocrisy.",
      ]),
      ch("meditations-book-6", "Book 6", 6, "paid", [
        "The substance of the universe is obedient and compliant; and the reason which governs it has in itself no cause for doing evil, for it has no malice, nor does it do evil to anything, nor is anything harmed by it.",
        "Take pleasure in one thing and rest in it, in passing from one social act to another social act, thinking of God.",
        "The ruling principle is that which rouses itself, and makes itself what it is, and makes itself whatever it wills to be.",
        "If any man has done wrong, the harm is his own. But perhaps he has not done wrong.",
        "Either the universe is a mere jumble and a chance medley, or it is order and providence. If the former, why should I wish to tarry in a chance combination and confusion? Why should I care about anything else than how I shall at last become earth? And why should I be disturbed, for the dispersion will come upon me, whatever I do? But if the other supposition is true, I venerate, and I am of good cheer, and I trust in him who governs.",
        "Asia, Europe are corners of the universe: all the sea a drop in the universe; Athos a little clod of the universe: all the present time is a point in eternity. All things are little, changeable, perishable.",
        "It is a shame for the soul to be first to give way in this life, when thy body does not give way.",
        "Take care not to feel towards the inhuman as they feel towards men.",
        "How many after being celebrated by fame have been given up to oblivion; and how many who have celebrated the fame of others have long been dead.",
      ]),
      ch("meditations-book-7", "Book 7", 7, "paid", [
        "What is badness to thee? It is that which thou hast often seen. And on the occasion of everything which happens keep this in mind, that it is that which thou hast often seen.",
        "The universe is either a confusion, and a mutual involution of things, and a dispersion; or it is unity and order and providence. If then it is the former, why do I wish to tarry in a fortuitous combination of things and such a disorder? Why do I care about anything else than how I shall at last become earth?",
        "Near is thy forgetfulness of all things; and near the forgetfulness of thee by all.",
        "It is peculiar to man to love even those who do wrong. And this happens, if when they do wrong it occurs to thee that they are kinsmen, and that they do wrong through ignorance and unintentionally, and that soon both of you will die; and above all, that the wrong-doer has done thee no harm, for he has not made thy ruling faculty worse than it was before.",
        "Whatever may happen to thee, it was prepared for thee from all eternity; and the implication of causes was from eternity spinning the thread of thy being, and of that which is incident to it.",
        "Look within. Within is the fountain of good, and it will ever bubble up, if thou wilt ever dig.",
        "The body ought to be compact, and to show no irregularity either in motion or attitude. For what the mind shows in the face by maintaining in it the expression of intelligence and propriety, that ought to be required also in the whole body.",
        "The art of life is more like the wrestler's art than the dancer's, in respect of this, that it should stand ready and firm to meet onsets which are sudden and unexpected.",
      ]),
      ch("meditations-book-8", "Book 8", 8, "paid", [
        "This reflection also tends to the removal of the desire of empty fame, that no longer, nor yet at all, it is in thy power to have lived the whole of thy life, or at least thy life from thy youth, like a philosopher. It is then inconsistent for thee who seest all this clearly to be wounded by the thought of not having fame.",
        "On the occasion of every act ask thyself, How is this with respect to me? Shall I repent of it? A little time and I am dead, and all is gone.",
        "This is the chief thing: Be not perturbed, for all things are according to the nature of the universal; and in a little time thou wilt be nobody and nowhere, like Hadrian and Augustus.",
        "Receive wealth or prosperity without arrogance; and be ready to let it go.",
        "If thou art pained by any external thing, it is not this thing that disturbs thee, but thy own judgement about it. And it is in thy power to wipe out this judgement now.",
        "Let not future things disturb thee, for thou wilt come to them, if it shall be necessary, having with thee the same reason which now thou usest for present things.",
        "Whatever happens at all happens as it should; thou wilt find this true, if thou shouldst watch narrowly.",
        "Remember that to change thy opinion and to follow him who corrects thy error is as consistent with freedom as it is to persist in thy error.",
        "Men exist for the sake of one another. Teach them then or bear with them.",
      ]),
      ch("meditations-book-9", "Book 9", 9, "paid", [
        "He who acts unjustly acts impiously. For since the universal nature has made rational animals for the sake of one another to help one another according to their deserts, but in no way to injure one another, he who transgresses her will, is clearly guilty of impiety towards the highest divinity.",
        "It would be a man's happiest lot to depart from mankind without having had any taste of lying and hypocrisy and luxury and pride. However to breathe out one's life when a man has had enough of these things is the next best voyage, as the saying is.",
        "Loss is nothing else than change. But the universal nature delights in change, and through this all things which exist are now accomplished, and in like manner will be from eternity.",
        "Penetrate inwards into men's leading principles, and thou wilt see what judges thou art afraid of, and what kind of judges they are of themselves.",
        "All things are implicated with one another, and the bond is holy; and there is hardly anything unconnected with any other thing. For things have been co-ordinated, and they combine to form the same universe.",
        "If our intellectual part is common, the reason also, in respect of which we are rational beings, is common: if this is so, common also is the reason which commands us what to do, and what not to do; if this is so, there is a common law also; if this is so, we are fellow-citizens; if this is so, we are members of some political community.",
        "Wipe out the imagination. Stop the pulling of the strings. Confine thyself to the present. Understand well what happens either to thee or to another. Divide and distribute every object into the causal (formal) and the material.",
      ]),
      ch("meditations-book-10", "Book 10", 10, "paid", [
        "Wilt thou, then, my soul, never be good and simple and one and naked, more manifest than the body which surrounds thee? Wilt thou never enjoy an affectionate and contented disposition? Wilt thou never be full and without a want of any kind, longing for nothing more, nor desiring anything, either animate or inanimate, for the enjoyment of pleasures?",
        "Observe what thy nature requires, so far as thou art governed by nature. Then do it and accept it, if thy nature, so far as thou art a living being, shall not be made worse by it.",
        "Everything which happens either happens in such wise as thou art formed by nature to bear it, or as thou art not formed by nature to bear it. If then it happens to thee in such way as thou art formed by nature to bear it, do not complain, but bear it as thou art formed by nature to bear it.",
        "Let this always be plain to thee, that this universe is one living being, having one substance and one soul; and observe how all things have reference to one perception, the perception of this one living being.",
        "The man who has not one and always the same object in life, cannot be one and the same all through his life. But what I have said is not enough, unless this also is added, what this object ought to be. For as there is not the same opinion about all the things which in some way or other are considered by the majority to be good, but only about some certain things, that is, things which concern the common interest, so also ought we to propose to ourselves an object of a civic kind and a political.",
        "Acquire the contemplative way of seeing how all things change into one another, and constantly attend to it, and exercise thyself about this part of philosophy. For nothing is so much adapted to produce magnanimity.",
      ]),
      ch("meditations-book-11", "Book 11", 11, "paid", [
        "These are the properties of the rational soul: it sees itself, analyses itself, and makes itself such as it chooses; the fruit which it bears itself enjoys — for the fruits of plants and that in animals which corresponds to fruits others enjoy — it obtains its own end, wherever the limit of life may be fixed.",
        "Thou wilt set little value on pleasing song and dancing and the pancratium, if thou wilt distribute the melody of the voice into its several sounds, and ask thyself as to each, if thou art mastered by this.",
        "There is no nature which is inferior to another nature, for the one cooperates with the other, as man cooperates with man.",
        "If any have offended against thee, consider first: What is my relation to men, and that we are made for one another; and in another respect, I was made to be set over them, as a ram over the flock or a bull over the herd.",
        "How unsound and insincere is he who says, I have determined to deal with thee in a fair way. — What art thou doing, man? There is no occasion to give this notice. It will soon show itself by acts. The voice ought to be plainly written on the forehead.",
        "He who has seen present things has seen all, both everything which has taken place from all eternity and everything which will be for time without end; for all things are of one kin and of one form.",
      ]),
      ch("meditations-book-12", "Book 12", 12, "paid", [
        "All those things at which thou wishest to arrive by a circuitous road, thou canst have now, if thou dost not refuse them to thyself. And this means, if thou wilt take no notice of all the past, and trust the future to providence, and direct the present only conformably to piety and justice.",
        "How ridiculously is he who wonders at anything which happens in life.",
        "Consider that everything is opinion, and opinion is in thy power. Take away then, when thou choosest, thy opinion, and like a mariner, who has doubled the promontory, thou wilt find calm, everything stable, and a waveless bay.",
        "The things are three of which thou art composed, a little body, a little breath (life), intelligence. Of these the first two are thine, so far as it is thy duty to take care of them; but the third alone is properly thine.",
        "I have often wondered how it is that every man loves himself more than all the rest of men, but yet sets less value on his own opinion of himself than on the opinion of others.",
        "If it is not right, do not do it: if it is not true, do not say it. For let thy efforts be —",
        "With respect to that which always flows, expect neither good nor evil, any more than from the wind which is passing, or from the water which is changing.",
        "If it is in thy power, why dost thou do it? If it is in the power of another, whom dost thou blame, atoms (chance) or gods? Both are foolish. Blame no one.",
        "Constantly contemplate the whole of time and the whole of substance, and consider that all individual things as to substance are a grain of a fig, and as to time, the turning of a gimlet.",
        "Think of the universal substance, of which thou hast a very small portion; and of universal time, of which a short and indivisible interval has been assigned to thee; and of that which is fixed by destiny, and how small a part of it thou art.",
      ]),
    ],
  },
  {
    slug: "letters-from-a-stoic-vol-1",
    title: "Letters from a Stoic Vol 1",
    author: "Lucius Annaeus Seneca",
    description:
      "The first volume of Seneca's Moral Letters to Lucilius — short, urgent counsel on time, friendship, and the examined life.",
    sourceUrl: "https://en.wikisource.org/wiki/Moral_letters_to_Lucilius",
    motif: "quill",
    tone: 1,
    chapters: [
      ch("letters-from-a-stoic-1-on-saving-time", "I. On Saving Time", 1, "free", [
        "Greetings from Seneca to his friend Lucilius. Continue to act thus, my dear Lucilius — set yourself free for your own sake; gather and save your time, which till lately has been forced from you, or filched away, or has merely slipped from your hands.",
        "Certain moments are torn from us, some are gently removed, and others glide beyond our reach. The most disgraceful kind of loss, however, is that due to carelessness. Furthermore, if you will pay close heed to the problem, you will find that the largest portion of our life passes while we are doing ill, a goodly share while we are doing nothing, and the whole while we are doing that which is not to the purpose.",
        "What man can you show me who places any value on his time, who reckons the worth of each day, who understands that he is dying daily? For we are mistaken when we look forward to death; the major portion of death has already passed. Whatever years be behind us are in death's hands.",
        "Therefore, Lucilius, hold in check this agency that takes wings and flies away. Lay hold of today's task, and you will not need to depend so much upon to-morrow's. While we are postponing, life speeds by.",
        "Nothing, Lucilius, is ours, except time. We were entrusted by nature with the ownership of this single thing, so fleeting and slippery that anyone who will can oust us from possession. What fools these mortals be! They allow the cheapest and most useless things, which can easily be replaced, to be charged in the reckoning, after they have acquired them; but they never regard themselves as in debt when they have received some of that precious commodity — time!",
        "I am ashamed to draw to a close such a letter as this, and still be in your debt. I shall owe, therefore, a daily contribution; and I shall keep paying it, until the account is square. You need not fear, however, that I shall ruin you. My resources are sufficient for this.",
      ]),
      ch(
        "letters-from-a-stoic-2-on-discursiveness",
        "II. On Discursiveness in Reading",
        2,
        "free",
        [
          "Judging by what you write me, and by what I hear, I am forming a good opinion regarding your future. You do not run hither and thither and distract yourself by changing your abode; for such restlessness is the sign of a disordered spirit.",
          "The primary indication, to my thinking, of a well-ordered mind is a man's ability to remain in one place and linger in his own company. Be careful, however, lest this reading of many authors and books of every sort may tend to make you discursive and unsteady.",
          "You must linger among a limited number of master-thinkers, and digest their works, if you would derive ideas which shall win firm hold in your mind. Everywhere means nowhere. When a person spends all his time in foreign travel, he ends by having many acquaintances, but no friends. And the same thing must hold true of men who seek intimate acquaintance with no single author, but visit them all in a hasty and hurried manner.",
          "Food does no good and is not assimilated into the body if it leaves the stomach as soon as it is eaten; nothing hinders a cure so much as frequent change of medicine; no wound will heal when one salve is tried after another; a plant which is often moved can never grow strong.",
          "Each day acquire something that will fortify you against poverty, against death, indeed against other misfortunes as well; and after you have run over many thoughts, select one to be thoroughly digested that day.",
        ],
      ),
      ch(
        "letters-from-a-stoic-3-on-true-friendship",
        "III. On True and False Friendship",
        3,
        "free",
        [
          "You have sent a letter to me through the hand of a 'friend' of yours, as you call him. And in your very next sentence you warn me not to discuss with him all the matters that concern you, saying that even you yourself are not accustomed to do this; in other words, you have in the same letter affirmed and denied that he is your friend.",
          "Now if you used this word of ours in the popular sense, and called him 'friend' in the same way in which we speak of all candidates for election as 'honourable gentlemen,' or as we greet all men whom we meet casually, if we have forgotten their names, with the salutation 'my dear sir' — so be it.",
          "But if you consider any man a friend whom you do not trust as you trust yourself, you are mightily mistaken and you do not sufficiently understand what true friendship means. Indeed, I would have you discuss everything with a friend; but first of all discuss the man himself.",
          "When friendship is settled, you must trust; before friendship is formed, you must pass judgment. Those persons indeed put last first and confound their duties, who, violating the rules of Theophrastus, judge a man after they have made him their friend, instead of making him their friend after they have judged him.",
          "Ponder for a long time whether you shall admit a given person to your friendship; but when you have decided to admit him, welcome him with all your heart and soul. Speak as boldly with him as with yourself.",
        ],
      ),
      ch(
        "letters-from-a-stoic-4-on-the-terrors-of-death",
        "IV. On the Terrors of Death",
        4,
        "paid",
        [
          "Keep on as you have begun, and make all possible haste, so that you may have longer enjoyment of an improved mind, one that is at peace with itself. Doubtless you are driving at this, and aiming thereunto, if you persist in your effort and do not let your purpose grow cold.",
          "Most men ebb and flow in wretchedness between the fear of death and the hardships of life; they are unwilling to live, and yet they do not know how to die. For this reason, make life as a whole agreeable to yourself by banishing all worry about it.",
          "No man can have a peaceful life who thinks too much about lengthening it, or believes that living through many consulships is a great blessing. Rehearse this thought every day, that you may be able to depart from life contentedly; for many men clutch and cling to life, even as those who are carried down a rushing stream clutch and cling to briars and sharp rocks.",
          "Most men ebb and flow in wretchedness between the fear of death and the hardships of life; they are unwilling to live, and yet they do not know how to die.",
          "You will notice that the most powerful and highly stationed men are daily betraying by signs whether they know their own happiness. Some things, however, are received by us with a smile, others with a shudder. And yet life includes them both.",
        ],
      ),
      ch(
        "letters-from-a-stoic-5-on-the-philosophers-life",
        "V. On the Philosopher's Mean",
        5,
        "paid",
        [
          "I commend you and rejoice in the fact that you are persistent in your studies, and that, putting all else aside, you make it each day's purpose to become a better man. I do not merely exhort you to keep travelling in this way; I implore you to do so.",
          "I warn you, however, not to act after the fashion of those who wish to be conspicuous rather than to improve, by doing things which will rouse comment as regards your dress or living. Repellent attire, unkempt hair, slovenly beard, open scorn of silver dishes, a couch on the bare earth, and any other perverted forms of self-display, are to be avoided.",
          "The mere name of philosophy, however quietly pursued, is an object of sufficient scorn; and what would happen if we should begin to separate ourselves from the customs of our fellow-men? Inwardly, we ought to be different in all respects, but our exterior should conform to society.",
          "Let us try to maintain a higher standard of life than that of the multitude, but not a contrary standard; otherwise, we shall frighten away those whom we are trying to improve.",
        ],
      ),
      ch("letters-from-a-stoic-6-on-sharing", "VI. On Sharing Knowledge", 6, "paid", [
        "I feel, my dear Lucilius, that I am being not only reformed, but transformed. I do not yet, however, assure myself, or indulge the hope, that there are no elements left in me which need to be changed.",
        "And indeed this very fact is proof that my spirit is altered into something better, — that it can see its own faults, of which it was previously ignorant. In certain cases, sick men are to be congratulated because they themselves perceive that they are sick.",
        "I should like to have you share my wonder at the progress I have already made. I used to be eager to give you a share of all that I learned; now I am eager to learn so that I may have something to give. Nothing will ever please me, no matter how excellent or beneficial, if I must retain the knowledge of it to myself.",
        "No good thing is pleasant to possess, without friends to share it.",
      ]),
      ch("letters-from-a-stoic-7-on-crowds", "VII. On Crowds", 7, "paid", [
        "Do you ask me what you should regard as especially to be avoided? I say, crowds; for as yet you cannot trust yourself to them with safety. I shall admit my own weakness, at any rate; for I never bring back home the same character that I took abroad with me.",
        "Something of that which I have forced to be calm within me is disturbed; some of the foes that I have routed return again. Just as the sick man, who has been weak for a long time, is in such a condition that he cannot be taken out of the house without suffering a relapse, so we ourselves are affected when our souls are recovering from a lingering disease.",
        "To consort with the crowd is harmful; there is no person who does not make some vice attractive to us, or stamp it upon us, or taint us unconsciously therewith. Certainly, the greater the mob with which we mingle, the greater the danger.",
        "But nothing is so damaging to good character as the habit of lounging at the games; for then it is that vice steals subtly upon one through the avenue of pleasure.",
      ]),
      ch(
        "letters-from-a-stoic-8-on-the-philosopher",
        "VIII. On the Philosopher's Seclusion",
        8,
        "paid",
        [
          "You reply: 'Do you bid me shun the throng, and withdraw from men, and be content with my own conscience? Where are the counsels of your school, which order a man to die in the midst of active work?' As to the course which I seem to you to be urging on you now and then, my object in shutting myself up and locking the door is to be able to help a greater number.",
          "I never spend a day in idleness; I appropriate even a part of the night for study. I do not allow time for sleep but yield to it when I must, and when my eyes are wearied with waking and ready to fall shut, I keep them at their task.",
          "I have withdrawn not only from men, but from affairs, especially from my own affairs; I am working for later generations, writing down some ideas that may be of assistance to them.",
        ],
      ),
    ],
  },
  {
    slug: "letters-from-a-stoic-vol-2",
    title: "Letters from a Stoic Vol 2",
    author: "Lucius Annaeus Seneca",
    description:
      "Further letters on travel, grief, old age, and the quiet work of making progress.",
    sourceUrl: "https://en.wikisource.org/wiki/Moral_letters_to_Lucilius",
    motif: "quill",
    tone: 2,
    chapters: [
      ch("letters-vol-2-on-travel", "XXVIII. On Travel as a Cure for Discontent", 1, "free", [
        "Do you suppose that you alone have had this experience? Are you surprised, as if it were a novelty, that after such long travel and so many changes of scene you have not been able to shake off the gloom and heaviness of your mind? You need a change of soul rather than a change of climate.",
        "Though you may cross vast spaces of sea, and though, as our Vergil remarks, lands and cities are left astern, your faults will follow you whithersoever you travel.",
        "Socrates made the same remark to one who complained; he said: 'Why do you wonder that globe-trotting does not help you, seeing that you always take yourself with you? The reason which set you wandering is still in the saddle.'",
        "What pleasure is there in seeing new lands? Or in surveying cities and spots of interest? All your bustle is useless. Do you ask why such flight does not help you? It is because you flee along with yourself.",
      ]),
      ch("letters-vol-2-on-the-good", "XXXI. On Siren Songs", 2, "free", [
        "Now I recognize my Lucilius! He is beginning to reveal the character of which he gave promise. Set to work as you have begun, and settle yourself in that way of life to which you are naturally fitted.",
        "There is no reason why you should copy those whom you hear mumbling in corners and preaching philosophy, or holding forth in public, or gathering crowds. You have something better and more trustworthy: yourself.",
        "What then is the difference between you and them? They are like the orators who are hired to make a speech. You, on the other hand, are really in earnest.",
      ]),
      ch("letters-vol-2-on-old-age", "XII. On Old Age", 3, "free", [
        "Wherever I turn, I see evidences of my advancing years. I visited lately my country-place, and complained about the expense of an ageing building. My care-taker said the house was old. And this was the house which grew under my own hands! What has the future in store for me, if stones of my own age are already crumbling?",
        "Let us cherish and love old age; for it is full of pleasure if one knows how to use it. Fruits are most welcome when almost over; youth is most charming at its close; the last drink delights the toper, the glass which souses him and puts the finishing touch on his drunkenness.",
        "Life is most delightful when it is on the downward slope, but has not yet reached the abrupt decline.",
      ]),
      ch("letters-vol-2-on-grief", "LXIII. On Grief for Lost Friends", 4, "paid", [
        "I am grieved to hear that your friend Flaccus is dead, but I would not have you sorrow more than is fitting. That you should not mourn at all I shall hardly dare to insist; and yet I know that it is the better way. But what man will ever be so blessed with that ideal steadfastness of soul, unless he has already risen far above the reach of Fortune?",
        "Even such a man will be stung by an event like this, but it will be only a sting. We, however, may be forgiven for bursting into tears, if only our tears have not flowed to excess, and if we have checked them by our own efforts.",
        "Let not the eyes be dry when we have lost a friend, nor let them overflow. We may weep, but we must not wail.",
      ]),
      ch("letters-vol-2-on-quiet", "LI. On Baiae and Morals", 5, "paid", [
        "Do you think, then, that I am telling you that you should shun Baiae? I do not; but I do think that you should shun luxury, of which Baiae is the headquarters. Choose, therefore, a dwelling-place that is healthful, not only for the body, but for the character.",
        "If possible, we should live in a neighbourhood that is free from the uproar of vice. There is no reason why you should be more ready to live among the groaning of the sick than among the shouts of those who are carousing.",
      ]),
      ch("letters-vol-2-on-progress", "LXXV. On the Diseases of the Soul", 6, "paid", [
        "You have been promising me that you would travel with a lighter load, and I have been promising you that I would write a letter with a lighter load of words. I have kept my promise; now it is for you to keep yours.",
        "There are several classes of proficientes, men who are making progress. Some have not yet freed themselves from their passions; they are still standing in slippery places. Others have put aside their worst faults, but have not yet reached security. Others have gone so far that they cannot slip back, but they still lack confidence.",
        "The wise man is joyful, happy and calm, unshaken; he lives on a plane with the gods.",
      ]),
    ],
  },
  {
    slug: "letters-from-a-stoic-vol-3",
    title: "Letters from a Stoic Vol 3",
    author: "Lucius Annaeus Seneca",
    description: "Later letters on nature, virtue, and the last work of a life well examined.",
    sourceUrl: "https://en.wikisource.org/wiki/Moral_letters_to_Lucilius",
    motif: "quill",
    tone: 3,
    chapters: [
      ch("letters-vol-3-on-nature", "XC. On the Part Played by Philosophy", 1, "free", [
        "Who can doubt, my dear Lucilius, that life is the gift of the immortal gods, but that living well is the gift of philosophy? Hence the idea that our life owed to philosophy a debt greater than that which it owed to the gods, in the same degree that a good life is more of a benefit than mere life.",
        "Philosophy has the single task of discovering the truth about the divine and human. She is always in attendance upon religion. She teaches us how to worship, with love and with reverence, the divine; she instructs us in our duty to humanity.",
      ]),
      ch("letters-vol-3-on-virtue", "XCII. On the Happy Life", 2, "free", [
        "You and I are at one, I think, in holding that external things are not good or evil in themselves, but that the wise man is happy even in the midst of those things which are generally regarded as evils.",
        "Virtue is nothing else than right reason. All virtues are reasons; they are reasoning processes. If the reasons are right, then the virtues are also right.",
      ]),
      ch("letters-vol-3-on-death", "CII. On the Intimations of Our Immortality", 3, "paid", [
        "A letter from you has arrived, which I delayed answering, because it brought me to a topic of which I needed to think. For you ask whether every good is housed in the soul; and whether the good which results from our training is of the same character as that which is born with us.",
        "I have been investigating death, and I have been doing so not as one who is about to die, but as one who is going to leave this life. I am ready to go, and I shall not postpone the day.",
      ]),
      ch("letters-vol-3-on-self", "CXXIV. On the True Good", 4, "paid", [
        "I can give you a rule, in a few words, by which you may test yourself and discover whether you have already attained the good, or whether you are still on the way. The perfectly wise man, the possessor of complete virtue, is as happy as a man can be.",
        "That which is good is never too late. It is never out of date. It never grows old.",
      ]),
      ch("letters-vol-3-last", "LXXVII. On Taking One's Own Life", 5, "paid", [
        "This is the point, my dear Lucilius: it makes no difference at what point you stop. Stop wherever you will, only see to it that you add a good ending.",
        "Life, if courage to die be lacking, is slavery. Do you ask the reason for this? Because the man who has learned how to die has unlearned slavery.",
      ]),
    ],
  },
  {
    slug: "enchiridion",
    title: "The Enchiridion",
    author: "Epictetus",
    description:
      "The Handbook — fifty-three short maxims distilled from Epictetus' teaching: what is up to us, and what is not.",
    sourceUrl: "https://en.wikisource.org/wiki/The_Encheiridion_of_Epictetus",
    motif: "lamp",
    tone: 0,
    chapters: [
      ch("enchiridion-1-10", "Maxims 1–10", 1, "free", [
        "Of things some are in our power, and others are not. In our power are opinion, movement toward a thing, desire, aversion — and in a word, whatever are our own acts; not in our power are the body, property, reputation, offices, and in a word, whatever are not our own acts. The things in our power are by nature free, not subject to restraint nor hindrance; but the things not in our power are weak, slavish, subject to restraint, in the power of others. Remember then that if you think the things which are by nature slavish to be free, and the things which are in the power of others to be your own, you will be hindered, you will lament, you will be disturbed, you will blame both gods and men.",
        "Immediately prescribe some character and form to yourself, which you shall observe both when you are alone and when you meet with men. And let silence be the general rule, or let only what is necessary be said, and in few words.",
        "In everything which pleases the soul, or supplies a want, or is loved, remember to add this to the description: what is the nature of each thing, beginning from the smallest? If you are fond of an earthen cup, say it is an earthen cup of which you are fond; for then, if it is broken, you will not be disturbed.",
        "When you are going to take in hand any act, remind yourself what kind of an act it is. If you are going to bathe, place before yourself what happens in the bath: some splashing the water, others pushing against one another, others abusing one another, and some stealing. And thus with more safety you will undertake the act, if you say to yourself, I now intend to bathe, and to maintain my will in a manner conformable to nature.",
        "Men are disturbed not by the things which happen, but by the opinions about the things. For example, death is nothing terrible, for if it were, it would have seemed so to Socrates; for the opinion about death, that it is terrible, is the terrible thing. When then we are impeded or disturbed or grieved, let us never blame others, but ourselves, that is, our opinions.",
        "Be not elated at any excellence which is not your own. If a horse should be elated and say, I am handsome, it would be endurable. But when you are elated, and say, I have a handsome horse, you must know that you are elated at something good which belongs to a horse.",
        "If you would improve, submit to being considered without sense and foolish with respect to externals. Wish not that things should happen as you wish, but wish that they happen as they do happen: then your life will go well.",
        "Disease is an impediment to the body, but not to the will, unless the will itself chooses. Lameness is an impediment to the leg, but not to the will. And add this reflection on everything that happens; for you will find it an impediment to something else, but not to yourself.",
        "On the occasion of every accident that befalls you, remember to turn to yourself and inquire what power you have for turning it to use. If you see a fair person, you will find that the power to resist is temperance. If labour is presented to you, you will find it is endurance. If it is abusive words, you will find it is patience. And thus habituated, the appearances will not run away with you.",
        "Never say of anything, I have lost it; but, I have returned it. Is your child dead? It is returned. Is your wife dead? She is returned. Is your estate taken from you? Well, and is not that also returned? But he who took it from me is a bad man. But what is it to you, by whose hands he who gave it has demanded it back?",
      ]),
      ch("enchiridion-11-20", "Maxims 11–20", 2, "free", [
        "If you would improve, be content to be thought foolish and stupid with regard to externals. Do not wish to be thought to know anything; and though you should appear to be somebody to others, distrust yourself. For be assured, it is not easy both to keep your will in harmony with nature and to secure external things. If you would have the one, you must of necessity neglect the other.",
        "If you wish your children, and your wife, and your friends to live for ever, you are stupid; for you wish to be in control of things which you cannot. So likewise, if you wish your servant to be without fault, you are a fool; for you wish vice not to be vice, but something else.",
        "If you would have your children and wife and friends to live for ever, you are silly; for you wish things to be in your power which are not, and what belongs to others to be your own. So if you would have your slave to be free from faults, you are a fool; for you wish vice not to be vice but something else.",
        "If you ever happen to turn your attention to externals, for the pleasure of any one, be assured that you have ruined your scheme of life. Be content then in everything with being a philosopher; and if you wish to be thought so also by any one, appear so to yourself, and it will suffice you.",
        "Let death and exile, and all other things which appear terrible, be daily before your eyes, but death chiefly; and you will never entertain any abject thought, nor too eagerly covet anything.",
        "Seek not that the things which happen should happen as you wish; but wish the things which happen to be as they are, and you will have a tranquil flow of life.",
        "Disease is an impediment to the body, but not to the will, unless the will itself chooses. Lameness is an impediment to the leg, but not to the will.",
        "On the occasion of every accident (event) that befalls you, remember to turn to yourself and inquire what power you have for turning it to use.",
        "Never say about anything, I have lost it, but say I have restored it.",
        "If you would improve, lay aside such reasonings as these: if I neglect my affairs, I shall not have the means of living; unless I chastise my slave, he will be good for nothing.",
      ]),
      ch("enchiridion-21-35", "Maxims 21–35", 3, "paid", [
        "Let whatever appears to be the best be to you an inviolable law. And if any instance of pain or pleasure, glory or disgrace, be set before you, remember that now is the combat, now the Olympiad comes on, and it cannot be put off.",
        "If a person gave your body to any stranger he met, you would be angry. Are you not ashamed, then, that you give your mind to whoever comes along, so that, if he reviles you, it is disturbed and troubled?",
        "In every work, observe the things which come first, and those which follow, and so proceed to the work. If you do not, you will at first begin with spirit, but when nothing of the consequences has been thought of, you will afterwards be ashamed.",
        "The condition and characteristic of a vulgar person is that he never expects either benefit or hurt from himself, but from externals. The condition and characteristic of a philosopher is that he expects all hurt and benefit from himself.",
        "Signs of one who is making progress: he blames no one, praises no one, accuses no one, complains of no one, says nothing about himself as if he were somebody or knew something.",
        "If any one tells you that such a person speaks ill of you, do not make excuses about what is said of you, but answer: He does not know my other faults, else he would not have mentioned only these.",
        "When you do anything from a clear judgment that it ought to be done, never shun the being seen to do it, even though the world should make a wrong supposition about it. For if you do not act right, shun the act itself; but if you do, why are you afraid of those who censure you wrongly?",
        "As the 'Iliad' is nothing more than appearance, so are all things.",
        "When any person treats you ill or speaks ill of you, remember that he does this or says this because he thinks it is his duty. It is not possible then for him to follow that which seems right to you, but that which seems right to himself.",
        "These reasonings do not cohere: I am richer than you, therefore I am better than you; I am more eloquent than you, therefore I am better than you. On the contrary these rather cohere: I am richer than you, therefore my possessions are greater than yours; I am more eloquent than you, therefore my speech is superior to yours. But you are neither possession nor speech.",
      ]),
      ch("enchiridion-36-53", "Maxims 36–53", 4, "paid", [
        "If you have assumed a character above your strength, you have both acted in this matter in an unbecoming way, and you have neglected that which you might have fulfilled.",
        "In walking about, as you take care not to step on a nail, or to sprain your foot, so take care not to damage your ruling faculty. And if we observe this in every act, we shall undertake the act with more security.",
        "The will of nature may be learned from those things in which we do not differ from one another. For instance, when our neighbour's boy has broken a cup, or anything else, we are ready to say, These things must happen. You should know then that when your own cup also is broken, you ought to be affected just as you were when the other was broken.",
        "As a mark is not set up for the sake of missing it, so neither does the nature of evil exist in the world.",
        "If a person delivered your body to any one whom he met, you would be angry. Why then are you not ashamed that you deliver your mind to any person you meet, so that if he happens to revile you, it is disturbed and troubled?",
        "Everything has two handles, the one by which it may be carried, the other by which it cannot. If your brother does you wrong, do not take it by this handle, that he does you wrong (for this is the handle by which it cannot be carried); but by the other, that he is your brother, that he was brought up with you; and then you will take it by the handle by which it can be carried.",
        "It is no ordinary task to meet one's obligations, and to be at the same time a man.",
        "Upon every occasion we ought to have these maxims ready at hand: Lead me, O Zeus, and thou O Destiny, the way that I am bid by you to go; to follow I am ready. If my will shall fail, I still shall follow. And this: Whoever rightly yields to fate is deemed wise, and knows the things of God.",
        "Begin by prescribing to yourself some character and demeanour, such as you may preserve both when alone and in company.",
        "How long will you then still defer thinking yourself worthy of the best things, and in no matter transgressing the distinctions of reason? You have received the philosophic theorems with which you ought to be familiar, and you have been familiar with them. What kind of a teacher, then, do you still expect, that you should put off reforming yourself until he comes?",
      ]),
    ],
  },
  {
    slug: "on-the-shortness-of-life",
    title: "On the Shortness of Life",
    author: "Lucius Annaeus Seneca",
    description:
      "Life is long enough if you know how to use it. Seneca's most famous essay on wasted time.",
    sourceUrl: "https://en.wikisource.org/wiki/On_the_shortness_of_life",
    motif: "sun",
    tone: 1,
    chapters: [
      ch("shortness-1", "I. Life is long enough", 1, "free", [
        "The greater part of mortals, Paulinus, complain bitterly of the spitefulness of Nature, because we are born for a brief span of life, because even this space that has been given to us rushes by so speedily and so swiftly that all save a very few find life at an end just when they are getting ready to live.",
        "It is not that we have a short time to live, but that we waste a great deal of it. Life is long enough, and a sufficiently generous amount has been given to us for the highest achievements if it were all well invested.",
        "But when it is squandered in luxury and carelessness, when it is devoted to no good end, forced at last by the ultimate necessity we perceive that it has passed away before we were aware that it was passing.",
      ]),
      ch("shortness-2", "II. The busy man", 2, "free", [
        "You will hear many men saying: 'After my fiftieth year I shall retire into leisure; my sixtieth year shall release me from public duties.' And what guarantee, pray, have you that your life will last longer? Who will suffer your course to be just as you plan it?",
        "Are you not ashamed to reserve for yourself only the remnant of life, and to set apart for wisdom only that time which cannot be devoted to any business? How late it is to begin to live just when we must cease to live!",
        "What foolish forgetfulness of mortality to postpone wholesome plans to the fiftieth and sixtieth year, and to intend to begin life at a point to which few have attained!",
      ]),
      ch("shortness-3", "III. Time stolen", 3, "paid", [
        "Look back for a moment; consider when you ever had a fixed purpose; how few days have passed as you had planned; when you were ever at your own disposal; when your face wore its natural expression; when your mind was unperturbed.",
        "You will find that you have fewer years than you count. Call to mind when you ever had a fixed purpose; how few days have passed as you planned; when you were ever at your own disposal.",
        "Everyone hurries his life on and suffers from a desire for the future and a weariness of the present. But he who bestows all of his time on his own needs, who plans out every day as if it were his last, neither longs for nor fears the morrow.",
      ]),
      ch("shortness-4", "IV. The true leisure", 4, "paid", [
        "Of all men they alone are at leisure who take time for philosophy, they alone really live; for they are not content to be good guardians of their own lifetime only. They annex every age to their own.",
        "We are in the habit of saying that it was not in our power to choose the parents who were allotted to us. Yet we may be the sons of whomsoever we will — of philosophers, of the old writers. These will not have you for their heir unless you shall wish it.",
        "This is the only way of prolonging mortality — nay, of turning it into immortality. Honours, monuments, all that ambition has commanded by decrees or reared in works of stone, quickly sink to ruin; there is nothing that the lapse of time does not tear down and remove. But those things which are consecrated by the imagination of wise men are claimed by no age.",
      ]),
      ch("shortness-5", "V. Learning how to live", 5, "paid", [
        "Living is the least important activity of the preoccupied man; and yet there is nothing which is harder to learn. There are many who know how to win, but do not know how to use victory; many who have learned how to acquire, but not how to enjoy.",
        "It takes the whole of life to learn how to live, and — what will perhaps make you wonder more — it takes the whole of life to learn how to die.",
      ]),
    ],
  },
  {
    slug: "on-the-happy-life",
    title: "On the Happy Life",
    author: "Lucius Annaeus Seneca",
    description: "Happiness is not pleasure. It is a mind in agreement with its own nature.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_a_happy_life",
    motif: "sun",
    tone: 2,
    chapters: [
      ch("happy-life-1", "I. What we seek", 1, "free", [
        "All men, brother Gallio, wish to live happily, but are dull at perceiving exactly what it is that makes life happy. So far is it from being easy to attain the happy life, that the more eagerly a man struggles to reach it, the further he departs from it, if he takes the wrong road.",
        "We must therefore define clearly what it is we wish for. It is not that the road is long, but that we do not know whither we are going.",
      ]),
      ch("happy-life-2", "II. Pleasure is not the good", 2, "free", [
        "The highest good is a mind which despises the accidents of fortune, and rejoices only in virtue. That man is happy, I say, who knows no good or evil save a good or evil mind.",
        "True happiness is to enjoy the present, without anxious dependence upon the future, not to amuse ourselves with either hopes or fears but to rest satisfied with what we have, which is sufficient.",
      ]),
      ch("happy-life-3", "III. Virtue and joy", 3, "paid", [
        "The happy life is one which is in accordance with its own nature, and this cannot be unless first the mind is sound, and in lasting soundness; next, it must be strong and vigorous, then beautifully patient, fitted to the times, careful of the body and of all that belongs to it without being anxious.",
        "He is happy who is neither elated nor cast down by any external events. He is happy whose only measure of good and evil is his own reason.",
      ]),
    ],
  },
  {
    slug: "on-peace-of-mind",
    title: "On Peace of Mind",
    author: "Lucius Annaeus Seneca",
    description: "How a restless mind may come to rest — neither idle nor frantic.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_peace_of_mind",
    motif: "wave",
    tone: 0,
    chapters: [
      ch("peace-1", "I. The complaint", 1, "free", [
        "You ask me, Serenus, what is this unrest of mind which, though not a desperate disease, is yet a chronic one. I will tell you: it is not that we are ill, but that we are not well. We are neither in the harbour nor on the high sea.",
        "We wish for something, and then we repent of our wish. We oscillate between a desire for rest and a desire for action, and are pleased with neither.",
      ]),
      ch("peace-2", "II. The remedy", 2, "free", [
        "The mind must be called away from externals and retire into itself. It must trust itself, rejoice in itself, admire its own works; it must withdraw as far as possible from the affairs of others and devote itself to itself.",
        "The first thing is not to be busied about too many things. The second is not to attempt things beyond our strength. The third is to choose work that is useful and lasting.",
      ]),
      ch("peace-3", "III. Friendship and solitude", 3, "paid", [
        "Nothing, however, gives the mind so much pleasure as a faithful and pleasant friendship. What a blessing it is to have those into whose bosoms you may pour out every care, whose advice you may wait for in your own affairs, whose mirth may soothe your anxiety, whose very look may comfort you!",
        "Solitude and company should be mixed. The one will make us long for men, the other for ourselves. The one will remedy the other: solitude will heal the dislike of the crowd; the crowd will heal the weariness of solitude.",
      ]),
    ],
  },
  {
    slug: "enchiridion-version-2",
    title: "The Enchiridion (Version 2)",
    author: "Epictetus",
    description:
      "Elizabeth Carter's rendering of the Handbook — a second voice on the same maxims.",
    sourceUrl: "https://en.wikisource.org/wiki/Epictetus,_the_Enchiridion",
    motif: "lamp",
    tone: 2,
    chapters: [
      ch("enchiridion-v2-1", "What is ours", 1, "free", [
        "There are things which are within our power, and there are things which are beyond our power. Within our power are opinion, aim, desire, aversion, and, in one word, whatever affairs are our own. Beyond our power are body, property, reputation, office, and, in one word, whatever are not properly our own affairs.",
        "Now, the things within our power are by nature free, unrestricted, unhindered; but those beyond our power are weak, dependent, restricted, alien. Remember, then, that if you attribute freedom to things by nature dependent, and take what belongs to others for your own, you will be hindered, you will lament, you will be disturbed, you will find fault both with gods and men.",
      ]),
      ch("enchiridion-v2-2", "Appearances", 2, "free", [
        "Men are disturbed not by things, but by the views which they take of things. Thus death is nothing terrible, else it would have appeared so to Socrates. But the terror consists in our notion of death, that it is terrible.",
        "When, therefore, we are hindered, or disturbed, or grieved, let us never impute it to others, but to ourselves; that is, to our own views. It is the action of an uninstructed person to reproach others for his own misfortunes; of one entering upon instruction, to reproach himself; and of one perfectly instructed, to reproach neither others nor himself.",
      ]),
      ch("enchiridion-v2-3", "Practice", 3, "paid", [
        "If you wish to improve, be content to appear clueless and foolish in externals. Do not wish to be thought to know anything; and though you should appear to others to be somebody, distrust yourself.",
        "If you would be a good reader, you must read much; if a good writer, write; if a good speaker, practise speaking. So if you would be free, you must practise freedom in the small things first.",
      ]),
    ],
  },
  {
    slug: "discourses-book-1",
    title: "Discourses: Book 1",
    author: "Epictetus",
    description:
      "Classroom conversations recorded by Arrian — on what is up to us, and the beginning of philosophy.",
    sourceUrl: "https://en.wikisource.org/wiki/The_Discourses_of_Epictetus",
    motif: "lamp",
    tone: 1,
    chapters: [
      ch(
        "discourses-1-what-is-in-our-power",
        "I. Of the things which are in our power",
        1,
        "free",
        [
          "Of all the faculties, you will find not one which is capable of contemplating itself, and, consequently, not capable either of approving or disapproving. How far does the power of the grammarian extend? As far as the explaining of language. And of the musician? As far as the science of melody.",
          "But the reasoning faculty, being the only faculty that we have received which examines itself, what it is, and what power it has, and what is the value of this gift, and is the only faculty that contemplates itself — why will it not also contemplate everything else?",
          "If it had been possible, Epictetus used to say, the gods would have put that which is our own in our power, completely and securely. But they could not. Since we are on earth, tied to such a body, and in such company, how could it be that we should not be hindered by things outside us? But what the gods could give, they have given: the power of using appearances, and of not being deceived about them.",
        ],
      ),
      ch(
        "discourses-1-how-a-man-may-preserve",
        "II. How a man on every occasion can maintain his proper character",
        2,
        "free",
        [
          "To the rational animal only is the irrational intolerable; but that which is rational is endurable. Blows are not by nature intolerable. How is that? See how the Lacedaemonians endure whipping when they have learned that whipping is consistent with reason.",
          "When therefore any person has imagined something to be rational, he cannot bear to be moved from it, even if it is a mistake. Consider then, if you also have imagined something to be rational, and if you have, persist in it; if you have not, seek it.",
        ],
      ),
      ch("discourses-1-from-the-beginning", "IV. Of progress", 3, "paid", [
        "He who is making progress, having learned from philosophers that desire means the desire of good things, and aversion means aversion from bad things; having learned too that happiness and tranquillity are not attainable by man otherwise than by not failing to obtain what he desires, and not falling into that which he would avoid — such a person takes from himself desire altogether and postpones it to the future.",
        "Show me a man who is sick and happy, in danger and happy, dying and happy, in exile and happy, in disgrace and happy. Show him: I desire, by the gods, to see a Stoic.",
      ]),
      ch("discourses-1-providence", "VI. Of providence", 4, "paid", [
        "From everything which is or happens in the world, it is easy to praise Providence, if a man possesses these two qualities: the faculty of seeing what has happened to each person, and a grateful disposition.",
        "If we had understanding, ought we to do anything else both jointly and severally than to sing hymns and bless the deity, and to tell of his benefits?",
      ]),
    ],
  },
  {
    slug: "discourses-book-2",
    title: "Discourses: Book 2",
    author: "Epictetus",
    description: "On constancy, the nature of the good, and how a student should listen.",
    sourceUrl: "https://en.wikisource.org/wiki/The_Discourses_of_Epictetus",
    motif: "lamp",
    tone: 3,
    chapters: [
      ch("discourses-2-constancy", "I. That confidence does not conflict with caution", 1, "free", [
        "The opinion of the philosophers perhaps appears a paradox to some, but let us examine as well as we can if it is true that we ought to do all things both cautiously and confidently.",
        "For caution seems to be in a manner contrary to confidence, and contraries are by no means consistent. That which appears to many to be a paradox in this matter seems to me to consist chiefly in this mixing of terms.",
      ]),
      ch("discourses-2-good", "VIII. What is the nature of the good", 2, "paid", [
        "God is beneficial. But the good also is beneficial. It is consistent then that where the nature of God is, there also the nature of the good should be. What then is the nature of God? Flesh? Certainly not. An estate in land? By no means. Fame? No. He is intelligence, knowledge, right reason.",
        "Here then you seek the true nature of the good. For surely you do not seek it in a plant. No. Nor in a brute. No. If then you seek it in a rational animal, why do you still seek it anywhere except in that which distinguishes a rational animal from an irrational?",
      ]),
      ch("discourses-2-listen", "XXIV. How we should struggle with circumstances", 3, "paid", [
        "It is circumstances which show what men are. Therefore when a difficulty falls upon you, remember that God, like a trainer of wrestlers, has matched you with a rough young man.",
        "For what purpose? you may say. Why, that you may become an Olympic conqueror; but it is not accomplished without sweat.",
      ]),
    ],
  },
  {
    slug: "discourses-book-3",
    title: "Discourses: Book 3",
    author: "Epictetus",
    description: "On adornment, cynic courage, and the calling of a student of philosophy.",
    sourceUrl: "https://en.wikisource.org/wiki/The_Discourses_of_Epictetus",
    motif: "lamp",
    tone: 4,
    chapters: [
      ch("discourses-3-adornment", "I. Of personal adornment", 1, "free", [
        "A certain young man, a rhetorician, came to see Epictetus, with his hair dressed more carefully than was usual, and in a fancy dress. Tell me, said Epictetus, do you not think that some dogs are beautiful, and some horses, and so of other animals? I do, the young man said. Is not then a dog beautiful when it is an excellent dog of its kind, and a horse when it is an excellent horse? And so of a man: is he not beautiful when he is an excellent man?",
        "If then you wish to be beautiful, young man, labour at this, the thing which makes a man beautiful.",
      ]),
      ch("discourses-3-cynic", "XXII. On the calling of a Cynic", 2, "paid", [
        "When one of his pupils inquired of Epictetus, what sort of a man a Cynic ought to be, and what was the notion of the thing, Epictetus said: You shall hear. It is not possible to know this without great preparation and a gift of God.",
        "The Cynic must know that he is sent as a messenger from Zeus to men about good and bad things, to show them that they have wandered, and are seeking the substance of good and evil where it is not.",
      ]),
      ch(
        "discourses-3-student",
        "XXIII. To those who read and discuss for the sake of ostentation",
        3,
        "paid",
        [
          "First say to yourself what you would be; and then do what you have to do. For in nearly all other arts we see this. Those who would be athletes consider first what they wish to be, then they do the proper things.",
          "You are a little soul carrying around a corpse, as Epictetus used to say.",
        ],
      ),
    ],
  },
  {
    slug: "discourses-book-4",
    title: "Discourses: Book 4",
    author: "Epictetus",
    description: "On freedom — the last and largest of the Discourses.",
    sourceUrl: "https://en.wikisource.org/wiki/The_Discourses_of_Epictetus",
    motif: "lamp",
    tone: 5,
    chapters: [
      ch("discourses-4-freedom", "I. About freedom", 1, "free", [
        "He is free who lives as he wishes to live; who is neither subject to compulsion nor to hindrance, nor to force; whose movements to action are not impeded, whose desires attain their purpose, and who does not fall into that which he would avoid.",
        "Who, then, chooses to live in error? No man. Who chooses to live deceived, liable to mistake, unjust, unrestrained, discontented, mean? No man. No bad man then lives as he wishes, and no bad man is then free.",
      ]),
      ch("discourses-4-independence", "IV. About those who are eager to live quietly", 2, "paid", [
        "Remember that it is not only a desire for power and wealth that makes men humble and subservient to others, but also desire for quiet, and leisure, and travel, and learning. For it makes no difference what the external thing is, the value of which you have made yourself a slave to.",
        "If a man should seek not to be disturbed, he will be disturbed. If he should seek not to be hindered, he will be hindered.",
      ]),
      ch("discourses-4-end", "XII. About attention", 3, "paid", [
        "When you have let your mind loose for a little, do not think that you can recover it when you please. If then you would not be of a slow and useless understanding, if you would not be always adding something to the list of things which you will attend to to-morrow, you must accustom yourself to this: that if you have once let yourself go, you cannot recover yourself at your pleasure.",
        "To-day I must be at the lecture. Then I shall have leisure. When you have leisure, you will attend to yourself? And when will you attend to yourself, if you always postpone it?",
      ]),
    ],
  },
  {
    slug: "on-anger-book-1",
    title: "On Anger: Book 1",
    author: "Lucius Annaeus Seneca",
    description:
      "Anger is a brief madness. Book I asks what it is, and why the wise man will not have it.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_Anger",
    motif: "oak",
    tone: 1,
    chapters: [
      ch("anger-1-what", "I. What anger is", 1, "free", [
        "You have demanded of me, Novatus, that I should write how anger may be soothed, and it appears to me that you are right in feeling especial fear of this passion, which is above all others hideous and wild. For the others have some alloy of peace and quiet, but this consists wholly in action and the impulse of grief, raging with an utterly inhuman lust for arms, blood and tortures.",
        "Some of the wisest of men have in consequence of this called anger a short madness: for it is equally devoid of self-control, regardless of decency, forgetful of kinship, obstinately engrossed in whatever it begins to do, deaf to reason and advice, excited by trifling causes, awkward at perceiving what is true and just.",
      ]),
      ch("anger-1-not-useful", "II. Anger is not useful", 2, "paid", [
        "It is asked, is anger in accordance with nature? It will be clear that it is not, when we have compared it with man, who is of a peaceful and self-contained nature. What is milder than man, when he is in his right mind? What is crueller than anger?",
        "Reason herself, to whom the reins of power have been entrusted, remains mistress only so long as she is kept apart from the passions. If she mixes with them and is contaminated, she cannot restrain those whom she might once have cleared out of her path.",
      ]),
    ],
  },
  {
    slug: "on-anger-book-2",
    title: "On Anger: Book 2",
    author: "Lucius Annaeus Seneca",
    description: "How anger arises from opinion — and how it can be checked at the first motion.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_Anger",
    motif: "oak",
    tone: 2,
    chapters: [
      ch("anger-2-origin", "I. How anger begins", 1, "free", [
        "The question is, whether anger arises from impulse or from judgment. We think that it is aroused by the appearance of injury, but that it does not follow immediately upon the appearance. It waits for the mind's assent.",
        "Anger is an impulse, but one which is born only when the mind has approved it. It is not enough to receive an impression of injury: we must also judge that we have been injured, and wish to be avenged.",
      ]),
      ch("anger-2-remedy", "II. First remedies", 2, "paid", [
        "The best plan is to reject at once the first incentives to anger, to resist its very beginnings, and to take care not to be betrayed into it. For if once it begins to carry us away, it is hard to get back again into a healthy condition.",
        "The mind should not be trusted when it is sick. Let us not allow it to act. If it has once let slip the opportunity of checking itself, it will have no power to stop at a later time.",
      ]),
    ],
  },
  {
    slug: "on-anger-book-3",
    title: "On Anger: Book 3",
    author: "Lucius Annaeus Seneca",
    description: "Practical rules for living among the irritating.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_Anger",
    motif: "oak",
    tone: 3,
    chapters: [
      ch("anger-3-rules", "I. Daily rules", 1, "free", [
        "We shall succeed in avoiding anger, if we repeatedly set before our minds all the vices of anger, and estimate it at its real value. We must speak to it, accuse it, convict it; we must display its ugliness and compare it with the worst passions.",
        "Let us consider, too, how many men anger has ruined, what crimes it has caused, and how it has torn to pieces cities and whole nations.",
      ]),
      ch("anger-3-evening", "II. The evening review", 2, "paid", [
        "When the light has been removed and my wife has fallen silent, I scan the whole of my day and retrace all my deeds and words. I conceal nothing from myself, I pass nothing by. I have been harsh in speech: I will be more careful. I have been too eager: I will be slower.",
        "The sleep which follows this self-examination is particularly sweet. The mind, warned that it will have to give an account of itself, behaves more justly.",
      ]),
    ],
  },
  {
    slug: "on-consolation-to-helvia",
    title: "On Consolation: To Helvia",
    author: "Lucius Annaeus Seneca",
    description:
      "A son in exile writes to his mother — proving that banishment cannot touch a free mind.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_consolation_to_his_mother_Helvia",
    motif: "wave",
    tone: 1,
    chapters: [
      ch("helvia-1", "I. A son to his mother", 1, "free", [
        "Dearest mother, I have often had the impulse to console you, and have as often checked it. There were many things that encouraged me to venture to raise your spirits. In the first place, I thought I should have more power to raise you, if I had first raised myself.",
        "I have determined to conquer my grief, not to cheat it. I have determined, too, that you should not be worn out by your longing for me, when you have no cause to be unhappy on my account.",
      ]),
      ch("helvia-2", "II. Exile is a name", 2, "paid", [
        "Change of place does not take anything away from a man's virtue, nor does it add anything to it. We are born into a world in which no place is our own country, and every place is.",
        "It is the mind that makes rich or poor, not the store-house. Exile has taken from me my house, my friends, my country: it has not taken from me my mind.",
      ]),
    ],
  },
  {
    slug: "on-consolation-to-marcia",
    title: "On Consolation: To Marcia",
    author: "Lucius Annaeus Seneca",
    description: "To a mother who has mourned a son three years — on the proper length of grief.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_consolation_to_Marcia",
    motif: "wave",
    tone: 2,
    chapters: [
      ch("marcia-1", "I. Three years", 1, "free", [
        "If I did not know, Marcia, that you were as far removed from womanish weakness of mind as from all other vices, I should not yet have ventured to attack your grief, which has now been strengthened by time.",
        "A third year has now passed, and the first violence of your sorrow has somewhat relaxed. Yet your grief renews and grows young again, and has now settled into a stubborn habit.",
      ]),
      ch("marcia-2", "II. Nature of loss", 2, "paid", [
        "We have no claim to anything that we have received. We have been lent ourselves, and all that we call ours. Use it as a loan. The lender can call it in when he will.",
        "He has died: that is, he has finished his journey before you. He has not left you, but has gone before.",
      ]),
    ],
  },
  {
    slug: "on-consolation-to-polybius",
    title: "On Consolation: To Polybius",
    author: "Lucius Annaeus Seneca",
    description: "Grief observed from exile — how a public man may mourn without being unmade.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_consolation_to_Polybius",
    motif: "wave",
    tone: 3,
    chapters: [
      ch("polybius-1", "I. To a brother", 1, "free", [
        "Fortune has given you great office, Polybius, and with it a great duty: to be an example of constancy. All eyes are upon you. You may weep, but you may not be broken.",
        "It is a fine thing to be able to use one's grief, not to be used by it.",
      ]),
      ch("polybius-2", "II. Work as medicine", 2, "paid", [
        "Turn yourself to your work. There is no greater comfort than occupation that is worthy of you. Grief looks for leisure in which to grow.",
        "Let Caesar's business, and your books, and the memory of your brother as he was — not as he is missed — take up the hours that sorrow would devour.",
      ]),
    ],
  },
  {
    slug: "on-providence",
    title: "On Providence",
    author: "Lucius Annaeus Seneca",
    description: "Why good men suffer: the gods treat the brave as trainers treat athletes.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_providence",
    motif: "star",
    tone: 0,
    chapters: [
      ch("providence-1", "I. The question", 1, "free", [
        "You have asked me, Lucilius, why, if the world be ruled by providence, so many evils befall good men. This would be more fitly answered in a set work, when we should prove that providence governs the universe, and that God concerns himself with us.",
        "I will, for the present, reconcile you to the gods, who are best to the best men. For Nature never permits her good to be injured: between good men and the gods there is a friendship, contracted by virtue.",
      ]),
      ch("providence-2", "II. The athlete", 2, "free", [
        "God does not make a spoiled pet of a good man: he tests him, hardens him, and fits him for his own service. Do you ask why it is that God so often allows good men to be tossed about by evil fortune? He treats them as a trainer treats his athletes.",
        "No tree becomes rooted and sturdy unless many a wind assails it. Then it is that it tightens its grip and plants its roots more securely. Fragile are those trees that have grown in a sunny valley.",
      ]),
      ch("providence-3", "III. Disaster as distinction", 3, "paid", [
        "Disaster is virtue's opportunity. Those whom God approves, he tries, he hardens, he prepares for himself. Why are you surprised that good men are shaken, in order that they may grow strong?",
        "Fire tests gold, misfortune tests brave men. See how high virtue has to climb: it is not a quiet or an easy path that leads to the stars.",
      ]),
    ],
  },
  {
    slug: "on-the-firmness-of-the-wise-man",
    title: "On the Firmness of the Wise Man",
    author: "Lucius Annaeus Seneca",
    description: "The sage cannot be injured — insult and injury stop at the body.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_the_constancy_of_the_wise_man",
    motif: "column",
    tone: 4,
    chapters: [
      ch("firmness-1", "I. The claim", 1, "free", [
        "I might fairly, Serenus, be ashamed of you, if I, who have long been devoted to the study of wisdom, had not yet made such progress as to be able to shield myself from the weapons of the world. But I am not yet wise, nor shall I ever be. Ask me, rather, to show you the wise man as he is described, not as I am.",
        "The wise man can receive neither injury nor insult. The weapons of the world fall short of him, as missiles shot into the air fall back before they reach the sky.",
      ]),
      ch("firmness-2", "II. Insult", 2, "paid", [
        "Injury is to take something from a man against his will. The wise man has nothing which can be taken from him. All his goods are in himself. Insult is a lesser thing: a slight, a contempt. He who is truly great is not even reached by it.",
        "Cato was spat upon in the face. He wiped it, and said, 'I will affirm to any one, Lucilius, that I am not angry.'",
      ]),
    ],
  },
  {
    slug: "on-leisure",
    title: "On Leisure",
    author: "Lucius Annaeus Seneca",
    description: "Whether a Stoic may retire from public life — and what retirement is for.",
    sourceUrl: "https://en.wikisource.org/wiki/Of_leisure",
    motif: "scroll",
    tone: 2,
    chapters: [
      ch("leisure-1", "I. Two republics", 1, "free", [
        "We shall first consider whether it is permissible to withdraw from public business. It is a much discussed question, whether a wise man ought to engage in politics. Some have thought that a life of retirement is best. Zeno and Chrysippus both withdrew, in a sense, in order to teach.",
        "Let us grasp the idea that there are two republics — the great and truly common one, in which gods and men are contained, and the other, the one to which the circumstances of birth have assigned us.",
      ]),
      ch("leisure-2", "II. What leisure is for", 2, "paid", [
        "Leisure without study is death; it is a tomb for the living man. What is the use of retirement, if you do not use it to become better?",
        "The duty of a man is to be useful to his fellow-men; if possible, to be useful to many; failing this, to be useful to a few; failing this, to be useful to his neighbours; failing this, to be useful to himself.",
      ]),
    ],
  },
  {
    slug: "self-reliance",
    title: "Self-Reliance",
    author: "Ralph Waldo Emerson",
    description:
      "An American essay that walks beside the Stoics: trust the god within, and be unashamed of your own mind.",
    sourceUrl: "https://en.wikisource.org/wiki/Essays:_First_Series/Self-Reliance",
    motif: "oak",
    tone: 0,
    chapters: [
      ch("self-reliance-1", "Trust thyself", 1, "free", [
        "I read the other day some verses written by an eminent painter which were original and not conventional. The soul always hears an admonition in such lines, let the subject be what it may. The sentiment they instil is of more value than any thought they may contain. To believe your own thought, to believe that what is true for you in your private heart is true for all men, — that is genius.",
        "A man should learn to detect and watch that gleam of light which flashes across his mind from within, more than the lustre of the firmament of bards and sages. Yet he dismisses without notice his thought, because it is his. In every work of genius we recognize our own rejected thoughts: they come back to us with a certain alienated majesty.",
        "Trust thyself: every heart vibrates to that iron string. Accept the place the divine providence has found for you, the society of your contemporaries, the connection of events.",
      ]),
      ch("self-reliance-2", "Conformity", 2, "free", [
        "Society everywhere is in conspiracy against the manhood of every one of its members. Society is a joint-stock company, in which the members agree, for the better securing of his bread to each shareholder, to surrender the liberty and culture of the eater. The virtue in most request is conformity. Self-reliance is its aversion.",
        "Whoso would be a man, must be a nonconformist. He who would gather immortal palms must not be hindered by the name of goodness, but must explore if it be goodness. Nothing is at last sacred but the integrity of your own mind.",
      ]),
      ch("self-reliance-3", "Consistency", 3, "paid", [
        "A foolish consistency is the hobgoblin of little minds, adored by little statesmen and philosophers and divines. With consistency a great soul has simply nothing to do. He may as well concern himself with his shadow on the wall.",
        "Speak what you think now in hard words, and to-morrow speak what to-morrow thinks in hard words again, though it contradict every thing you said to-day.",
      ]),
      ch("self-reliance-4", "The great man", 4, "paid", [
        "It is easy in the world to live after the world's opinion; it is easy in solitude to live after our own; but the great man is he who in the midst of the crowd keeps with perfect sweetness the independence of solitude.",
        "Insist on yourself; never imitate. Your own gift you can present every moment with the cumulative force of a whole life's cultivation; but of the adopted talent of another you have only an extemporaneous half possession.",
      ]),
    ],
  },
  {
    slug: "as-a-man-thinketh",
    title: "As a Man Thinketh",
    author: "James Allen",
    description:
      "A short modern classic on the mind as cause — kin to the Stoic claim that opinion makes the world.",
    sourceUrl: "https://en.wikisource.org/wiki/As_a_Man_Thinketh",
    motif: "sun",
    tone: 4,
    chapters: [
      ch("thinketh-thought-and-character", "Thought and Character", 1, "free", [
        "The aphorism, 'As a man thinketh in his heart so is he,' not only embraces the whole of a man's being, but is so comprehensive as to reach out to every condition and circumstance of his life. A man is literally what he thinks, his character being the complete sum of all his thoughts.",
        "As the plant springs from, and could not be without, the seed, so every act of a man springs from the hidden seeds of thought, and could not have appeared without them. This applies equally to those acts called 'spontaneous' and 'unpremeditated' as to those which are deliberately executed.",
        "Man is made or unmade by himself; in the armoury of thought he forges the weapons by which he destroys himself; he also fashions the tools with which he builds for himself heavenly mansions of joy and strength and peace.",
      ]),
      ch("thinketh-effect-of-thought", "Effect of Thought on Circumstances", 2, "free", [
        "Man's mind may be likened to a garden, which may be intelligently cultivated or allowed to run wild; but whether cultivated or neglected, it must, and will, bring forth. If no useful seeds are put into it, then an abundance of useless weed-seeds will fall therein, and will continue to produce their kind.",
        "Just as a gardener cultivates his plot, keeping it free from weeds, and growing the flowers and fruits which he requires, so may a man tend the garden of his mind, weeding out all the wrong, useless, and impure thoughts, and cultivating toward perfection the flowers and fruits of right, useful, and pure thoughts.",
      ]),
      ch("thinketh-health", "Thought and Health", 3, "paid", [
        "The body is the servant of the mind. It obeys the operations of the mind, whether they be deliberately chosen or automatically expressed. At the bidding of unlawful thoughts the body sinks rapidly into disease and decay; at the command of glad and beautiful thoughts it becomes clothed with youthfulness and beauty.",
        "Disease and health, like circumstances, are rooted in thought. Sickly thoughts will express themselves through a sickly body. Thoughts of fear have been known to kill a man as speedily as a bullet.",
      ]),
      ch("thinketh-purpose", "Thought and Purpose", 4, "paid", [
        "Until thought is linked with purpose there is no intelligent accomplishment. With the majority the bark of thought is allowed to 'drift' upon the ocean of life. Aimlessness is a vice, and such drifting must not continue for him who would steer clear of catastrophe and destruction.",
        "They who have no central purpose in their life fall an easy prey to petty worries, fears, troubles, and self-pityings, all of which are indications of weakness, which lead, just as surely as deliberately planned sins (though by a different route), to failure, unhappiness, and loss.",
      ]),
    ],
  },
  {
    slug: "poems",
    title: "Poems",
    author: "Ancient Voices",
    description: "Cleanthes' Hymn to Zeus, and other short pieces that Stoics kept by heart.",
    sourceUrl: "https://en.wikisource.org/wiki/Hymn_of_Cleanthes",
    motif: "star",
    tone: 5,
    chapters: [
      ch("poems-hymn-to-zeus", "Hymn to Zeus", 1, "free", [
        "Most glorious of the immortals, invoked by many names, ever all-powerful, Zeus, the First Cause of Nature, who rules all things with Law, Hail! It is right for mortals to call upon you, since from you we have our being, we whose lot it is to be God's image, we alone of all mortal creatures that live and move upon the earth.",
        "Therefore I will praise you with my hymn and ever sing of your might. The whole universe, spinning around the earth, goes wherever you lead it and is willingly guided by you.",
        "So great is the servant which you hold in your invincible hands, this two-edged, fiery, ever-living thunderbolt, with which you command the universal Word which moves through all creation.",
        "No deed is done on earth, God, without your office, nor along the divine ethereal sphere, nor in the sea, except what the wicked do in their folly.",
        "But you know how to make odd things even, and to order what is disorderly; for you love things unlovely. For thus you have fitted together all things into one, the good with the bad, that there might be one ever-existing Word of all things.",
      ]),
      ch("poems-cleanthes-prayer", "Cleanthes' Prayer", 2, "free", [
        "Lead me, O Zeus, and thou O Destiny, the way that I am bid by you to go; to follow I am ready. If my will shall fail, I still shall follow, though with a heavy heart. Whoever rightly yields to fate is deemed wise among men, and knows the things of God.",
      ]),
      ch("poems-fragments", "Stoic fragments", 3, "paid", [
        "Zeno: The end is to live in agreement with nature — which is to live according to virtue, for nature leads us towards virtue.",
        "Zeno: A bad feeling is a commotion of the mind repugnant to reason, and against nature.",
        "Cleanthes: He who consents well, fate leads; he who refuses, fate drags.",
        "Chrysippus: The universe itself is god, and the universal outpouring of its soul.",
        "Musonius Rufus: If you accomplish something good with hard work, the labour passes quickly, but the good endures; if you do something shameful in pursuit of pleasure, the pleasure passes quickly, but the shame endures.",
      ]),
    ],
  },
];
