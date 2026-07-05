"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import { Typeahead } from "@/components/Typeahead";
import { BackLink } from "@/components/ui/BackLink";
import { PageShell } from "@/components/ui/PageShell";
import type { EntryTags } from "@/components/EntryEditor";
import { LANGUAGES, PLACES, isValidMMDDYYYY, maskMMDDYYYY } from "@/lib/refdata";
import { api } from "@/lib/api";
import { tokens } from "@/styles/tokens";

const serif = tokens.font.serif;
const sans = tokens.font.sans;
const BLACK = tokens.color.black;
const LAVENDER = tokens.color.lavender;
const LAVENDER_FILL = tokens.color.lavenderFill;
const DARK_GREY = tokens.color.darkGrey;
const LIGHT_GREY = tokens.color.lightGrey;
const CREAM_FILL = tokens.color.cream;
const CREAM_STROKE = tokens.color.creamStroke;
const FOOTER_TEXT = tokens.color.footerText;

const DIMENSIONS = [
  { slug: "history",       label: "History",       sub: "Childhood, schools, milestones, the turning points." },
  { slug: "relationships", label: "Relationships",  sub: "The people who shaped you, how you love, how you fight." },
  { slug: "how-you-think", label: "How you think",  sub: "How you decide, process, land on answers." },
  { slug: "how-you-talk",  label: "How you talk",   sub: "Catchphrases, inside jokes, the way you say things." },
  { slug: "how-you-live",  label: "How you live",   sub: "Habits, rituals, the texture of your daily life." },
  { slug: "beliefs",       label: "Beliefs",        sub: "What you believe, what you'd stand up for. Your worldview and ideologies." },
  { slug: "heart",         label: "Heart",          sub: "What moves you. What you love, what you can't stand, what lights you up." },
];

const PROMPTS: Record<string, string[]> = {
  history: [
    "How your parents met, the way the story gets told in your family.",
    "What your family was reaching for in the years before you arrived. Where they were, what they were building.",
    "The version of your birth that gets retold. The day, the room, who was waiting on the other side of the door.",
    "Where your name came from, and what whoever chose it was hoping it would carry.",
    "A name that runs through your family. Who carried it before it reached you.",
    "What your family had already lived through before you got here.",
    "The country, city, or street your family came from before you were born.",
    "A photograph of your parents from before you existed. What you see in their faces.",
    "What was happening in the world the year you were born.",
    "Who almost named you something else, and what that name was.",
    "The family you were born into and the family you would have chosen. Whether they are the same.",
    "A relative you never met who shaped the family you were born into.",
    "The house you remember best as a child. Come through the front door and tell me what is there.",
    "A smell that puts you back in your childhood in one second.",
    "A sound you could pick out anywhere, left over from when you were small.",
    "What an ordinary weekend looked like when you were a kid.",
    "The food that meant home, and whose hands made it.",
    "A birthday from childhood that landed differently. What made that one matter.",
    "The friend who was your whole world back then, and where they are now.",
    "A place you used to disappear to when you needed to be alone.",
    "The first pet, toy, or object you loved like it was alive.",
    "A family trip you still measure other trips against.",
    "The teacher whose name you still remember, and why.",
    "What you were afraid of as a child, and whether it ever left.",
    "The first funeral, wedding, or birth you remember being part of.",
    "A holiday your family did its own particular way.",
    "The job your parents did, and what you understood about it as a child.",
    "Where you lived between five and ten, and what that place sounded like at night.",
    "A rule in your house that you have never questioned until right now.",
    "The sibling, cousin, or neighbor you measured yourself against.",
    "The year school stopped feeling small.",
    "The first time you understood your family was different from someone else's.",
    "The bedroom you had as a teenager. What was on the walls.",
    "A song that owns a specific year of your adolescence.",
    "The first time an adult treated you like one.",
    "A friendship that ended in those years, and how.",
    "The first big argument you had with a parent, and what it was really about.",
    "Where you thought you would be by now, back when you were sixteen.",
    "The first time you left home overnight on your own terms.",
    "A teacher or coach who saw something in you before you saw it.",
    "The job, gig, or hustle that first put money in your hand.",
    "The first heartbreak, and how long it took to lift.",
    "The first place you lived that was yours, and what you put on the walls.",
    "The first answer you ever gave when someone asked what you wanted to be, and how close you got.",
    "The year that split your life into a before and an after.",
    "The first time you left home for real.",
    "A decision you made young that you are still living inside of.",
    "The friend who carried you through your twenties.",
    "The first time you held a job that felt like it was yours.",
    "A city that made you into a slightly different person.",
    "The night in your twenties you would relive exactly.",
    "When you stopped being a child, whenever that actually was.",
    "The first time you paid for something that mattered with your own money.",
    "A risk you took early that you would never take now, and are glad you did.",
    "The work you have spent the most hours of your life doing.",
    "A home you made from nothing, and what it took.",
    "The person who became family without being born into it.",
    "A move that you are still not sure was the right one.",
    "The decade you grew the most, and what did the growing.",
    "A door that closed, and the one that opened because of it.",
    "The hardest year, and the thing that got you through it.",
    "A title, role, or responsibility that changed how you saw yourself.",
    "The day you became responsible for someone other than yourself.",
    "A version of your life you almost lived, and the fork where it split off.",
    "The thing you built that will outlast you.",
    "A loss that rearranged everything that came after it.",
    "The longest you have ever lived in one place, and why you stayed.",
    "The friend you have known the longest, and what has kept it.",
    "The day you decided this was the person.",
    "The wedding, the ceremony, or the quiet decision, however it actually happened.",
    "The day a child arrived, and the first thing you felt.",
    "What you swore you would do differently from your own parents, and whether you did.",
    "The name you gave a child, and what you hoped it would carry.",
    "A tradition you started that did not exist before you.",
    "Where you live now, and how you ended up here of all places.",
    "The objects in your home that hold the most history.",
    "A photograph on your wall and the day behind it.",
    "The people who are still here, and the ones whose absence you feel daily.",
    "What an ordinary day looks like now, start to finish.",
    "The thing you are most proud of having lived through.",
    "The three places that made you, in order.",
    "A scar, on your body or otherwise, and the day you got it.",
    "The repeated mistake you can now see across your whole life.",
    "The phone call that changed a day, or a decade.",
    "A stranger who altered your life in five minutes and never knew.",
    "The thing your family does not talk about.",
    "The inheritance that was not money. What got passed down.",
    "A year you would relive, and a year you would not.",
    "Someone who left before they should have, and what they did not get to see.",
    "The oldest memory you can actually trust as your own.",
    "The first death that taught you what death was.",
    "A promise you kept across decades.",
    "The map of every place you have ever lived, in order.",
    "A document, letter, or object you would run back into a fire for.",
    "The story your family tells about you that you are tired of, and the one they have wrong.",
    "What you were doing the day you found out the world had changed. Pick the day.",
    "The reunion you are still waiting for.",
    "A debt you owe someone who will never know you paid attention.",
    "The longest journey you ever took, and what you were really traveling toward.",
    "If your life were divided into chapters, where the breaks would fall, and what you would title them.",
  ],
  relationships: [
    "The first person who made you feel completely safe, and what they did.",
    "How love was shown in the house you grew up in. Words, food, presence, or none of those. Whether you were a child who clung or a child who ran ahead.",
    "The first time you felt left out, and what you did with it.",
    "How conflict sounded in your childhood home. Loud, silent, or somewhere in between.",
    "Whether you were the peacemaker, the instigator, or the one who left the room.",
    "The first secret you ever kept, and who it was for.",
    "How you learned what an apology was supposed to look like.",
    "Whether you were trusted as a child, and what that did to you.",
    "The first friendship where you felt truly chosen.",
    "How you handled your first crush. Bold, frozen, or sideways.",
    "Whether you were a follower or a ringleader in your group.",
    "The first time you betrayed a friend, or were betrayed, and what it taught you.",
    "How you fought with people you loved at sixteen, and whether you still fight that way.",
    "Whether you let people in slowly or all at once.",
    "The first time you forgave someone for something real.",
    "How you handled being the new person in a room.",
    "Whether your friendships were few and deep or many and light.",
    "How you behave in the first month of knowing someone you like.",
    "The way you show someone you love them without saying it.",
    "What makes you feel loved, specifically, in a way you rarely tell people.",
    "Whether you need a lot of closeness or a lot of room, and how you negotiate it.",
    "The thing you do when someone cries in front of you.",
    "Whether you remember the small things or the big ones.",
    "How you say goodbye at an airport.",
    "What you do when you miss someone.",
    "The kind of touch that means the most to you.",
    "How you love when you are at your best, and how you love when you are scared.",
    "Whether you go cold or go loud.",
    "The thing you reach for in an argument that you are not proud of.",
    "How you know an argument is actually over.",
    "Whether you need to win or need to be understood.",
    "What an apology has to contain before you can accept it.",
    "The fight you keep having, in different relationships, with different people.",
    "Whether you bring up the past or stay on the present.",
    "How you repair after you have hurt someone.",
    "What you do with silence in a conflict.",
    "The line that, once crossed, ends it for you.",
    "Whether forgiveness comes fast or takes years for you.",
    "The difference, for you, between forgiving and forgetting.",
    "Whether you can stay close to someone after they have hurt you.",
    "What it takes for you to trust someone again.",
    "Whether a room full of people fills you or drains you.",
    "The friend you call when something good happens, before anyone else.",
    "The friend you call when something terrible happens.",
    "Whether you process out loud or alone.",
    "How you behave when you are the most extroverted version of yourself.",
    "What you need after too much time with people.",
    "The kind of gathering you would host, and the kind you would skip.",
    "Whether you are the one who keeps the group together or the one who drifts.",
    "The thing you have learned to say no to.",
    "Whether you over-give or hold back.",
    "How you handle a friend who takes more than they return.",
    "The boundary you wish you had set years earlier.",
    "Whether you let people see you struggle.",
    "The favor you will always say yes to.",
    "The kind of person who gets past your defenses fast.",
    "Whether you keep score, even quietly.",
    "The friendship that taught you the most about who you are.",
    "A relationship you outgrew, and how you knew.",
    "The way your parents' marriage shaped how you love.",
    "What you do differently in love now than you did at twenty-five.",
    "The person who loved you in a way you did not know how to receive.",
    "Whether you are easier or harder to love than you used to be.",
    "A relationship you would repair if pride were not in the way.",
    "The friend you assume will be at your funeral, and why you are sure.",
    "How you behave around someone who is grieving.",
    "The way you say I love you when you cannot say the words.",
    "Whether you let people change, or hold them to who they were.",
    "The kind of loyalty you expect, and the kind you give.",
    "Whether you are the friend who reaches out or the one who waits to be reached.",
    "How you behave when a friend succeeds at the thing you wanted.",
    "Whether you remember birthdays, or rely on the people who do.",
    "The friend you have grown apart from and still love from a distance.",
    "How you act around someone you have just met but instantly like.",
    "Whether you give advice or just listen.",
    "The person whose approval you still seek without meaning to.",
    "How you handle a relationship where the love runs uneven.",
    "Whether you are the one who says sorry first.",
    "The friendship you would fight to keep, whatever it cost you.",
    "Who you would call at three in the morning, and who would call you.",
    "The relationship in your life that takes the most maintenance, and whether it is worth it.",
    "Whether you have told the people you love what they mean to you.",
    "The friend you have been meaning to call for too long.",
    "How you want to be cared for when you are old or sick.",
    "The relationship you are most grateful for right now.",
    "Whether you are good at being needed, or only at being independent.",
    "The person you have forgiven without ever telling them.",
    "How you handle distance with someone you love.",
    "The friend you would trust with your worst secret.",
    "What you want your closest people to know about how you love them.",
    "The relationship you most want to mend before it is too late.",
    "How you hope people describe what you were like to love.",
    "The kind of friend you are still trying to become.",
    "Whether you want to be remembered as steady or as exciting.",
    "The advice about love you would give your younger self.",
    "What you want the people you love to do when you are gone, with each other.",
    "The relationship lesson you hope gets passed to the next generation.",
    "Whether you have let yourself be fully known by anyone.",
    "The thing about how you love that no one has ever named correctly.",
  ],
  "how-you-think": [
    "The first thing you remember teaching yourself, with no one's help.",
    "Whether you were the kid who asked why, or the kid who took things apart.",
    "How you learned best as a child. Watching, doing, reading, or being told.",
    "The first problem you remember solving on your own.",
    "Whether you daydreamed or stayed present in class.",
    "A subject that came easily, and one that never did.",
    "Whether you memorized or understood, back when you had the choice.",
    "The first time you realized adults could be wrong.",
    "Whether you studied at the last minute or planned ahead, and which you still do.",
    "How you made decisions as a teenager. Gut, friends, or pros and cons.",
    "The first idea that genuinely blew your mind.",
    "Whether you argued to win or to figure something out.",
    "How you handled being wrong in front of people at that age.",
    "The way you remember things. Pictures, words, feelings, or places.",
    "Whether you decide fast and adjust, or slow and commit.",
    "The last big decision you made, and how you actually made it.",
    "Whether you trust your gut or distrust it.",
    "How many options you need before you can choose.",
    "What you do when two choices feel equal.",
    "Whether you decide alone or need to talk it through.",
    "How you know when you have enough information.",
    "The decision you are best at making, and the kind that paralyzes you.",
    "Whether you regret decisions or rarely look back.",
    "How you weigh what you want against what is sensible.",
    "Whether you sleep on it or decide on the spot.",
    "The role money plays in how you decide.",
    "Whether you trust logic or instinct when the two disagree.",
    "Whether you think out loud or go quiet to figure things out.",
    "What you do with a problem you cannot solve yet.",
    "Whether you think in words, images, or something else.",
    "How you untangle a situation that has too many parts.",
    "Whether you zoom in on detail or pull back to the whole.",
    "What you do when your mind will not stop running.",
    "Whether you need silence to think or thrive in noise.",
    "How long you can hold focus before you need to move.",
    "The time of day your mind is sharpest.",
    "Whether you finish one thing or run several at once.",
    "The last thing you taught yourself, and how you went about it.",
    "Whether you read the manual or figure it out by breaking it.",
    "How you absorb something new. Slowly and thoroughly, or fast and rough.",
    "What you do when you do not understand something.",
    "Whether you learn from your own mistakes or other people's.",
    "The skill you are proudest of having learned the hard way.",
    "Whether you ask questions freely or hate looking like you do not know.",
    "How you remember something you want to keep.",
    "Whether you read the news, avoid it, or take it in sideways.",
    "How you decide what to believe when sources disagree.",
    "Whether you fact-check or trust the people you trust.",
    "How many tabs, books, or threads you keep open at once.",
    "Whether you go deep on a few things or wide on many.",
    "What you do when someone tells you something that does not sound right.",
    "How you tell a good argument from a convincing one.",
    "Whether you change your mind easily or dig in.",
    "The last time you genuinely changed your mind about something big.",
    "How you handle information that contradicts what you already believe.",
    "The kind of thing you never forget, and the kind that slides off you.",
    "Whether you remember faces or names.",
    "The detail you remember from rooms long after the people.",
    "Whether your memory is reliable or you have made peace with its edits.",
    "How you keep track of what you need to do.",
    "The way you remember people who are gone.",
    "What pulls your focus when you are trying to concentrate.",
    "Whether you are a planner or you improvise.",
    "How far ahead you think. Days, years, or decades.",
    "Whether you finish books, projects, and thoughts, or leave them open.",
    "What you do when you are bored.",
    "Whether you overthink or underthink, honestly.",
    "How you talk yourself out of things.",
    "How you talk yourself into things.",
    "The first move you make when something breaks.",
    "Whether you look for who is responsible or what is wrong.",
    "How you handle a problem with no good options.",
    "Whether you ask for help early or exhaust yourself first.",
    "The kind of problem you find genuinely fun.",
    "How you break a huge task into a startable one.",
    "The question you have been turning over for years.",
    "The subject you could learn forever and never finish.",
    "What you do when something fascinates you.",
    "The thing you pretend to understand but do not.",
    "The thing you understand deeply that few people know you do.",
    "How you read a person in the first five minutes.",
    "Whether your first impressions are usually right.",
    "How you tell when someone is lying.",
    "What makes you trust a stranger.",
    "How you decide who to take advice from.",
    "How your thinking has changed from your twenties to now.",
    "Whether you have gotten more cautious or more decisive with age.",
    "A belief about how things work that you have had to unlearn.",
    "The mental habit you inherited from a parent.",
    "The way of thinking you most want to pass on.",
    "The mental tool you rely on most.",
    "Whether you think more clearly under pressure or fall apart.",
    "The thing you wish you could stop overanalyzing.",
    "How you want to keep your mind sharp as you age.",
    "The decision-making advice you would give your younger self.",
    "Whether you think your best thinking is behind you or ahead.",
    "The problem you most want to solve before you are done.",
    "How you would explain the way your mind works to someone who has to live with it.",
    "The thought that keeps you up, and the one that puts you to sleep.",
    "If someone inherited your way of thinking, what they should be warned about.",
  ],
  "how-you-talk": [
    "Where your accent comes from, and whether it has moved with you.",
    "The word that gives away where you are really from.",
    "Whether your voice changes when you call home.",
    "The accent you slip into without meaning to, and around whom.",
    "Whether people can place you by your voice.",
    "The way you sounded as a teenager versus now.",
    "Whether your voice is high, low, or somewhere you have made peace with.",
    "The language you count, curse, or pray in.",
    "Whether you talk fast or make people wait.",
    "Whether you are the loudest in the room or the one people lean in to hear.",
    "What happens to your speech when you are excited.",
    "What happens to your voice when you are angry. Louder, or dangerously quiet.",
    "Whether you fill silences or let them sit.",
    "How fast you talk when you are nervous.",
    "Whether you interrupt or wait your turn.",
    "How long your pauses are before you answer something hard.",
    "The word or phrase you say so often people tease you for it.",
    "The phrase you got from a parent and still use.",
    "A word you use that no one else seems to.",
    "The filler word you reach for. Like, you know, basically, right.",
    "The thing you always say when you answer the phone.",
    "How you greet people you love versus people you just met.",
    "The phrase you use to end a conversation.",
    "What you call people. Mate, love, man, dude, by their full name.",
    "A word you refuse to say.",
    "The thing you can never quite say out loud, so you talk around it.",
    "Whether you swear freely or almost never, and what shifts it.",
    "The compliment you find hard to give in plain words.",
    "Whether your humor is dry, loud, dark, or silly.",
    "Whether you tell jokes or just make people laugh by accident.",
    "The kind of thing that makes you laugh mid-sentence.",
    "Whether you are funnier in writing or out loud.",
    "The joke or bit you have been doing for years.",
    "Whether you laugh at your own jokes before the end.",
    "The kind of humor that goes over your head.",
    "Whether you use humor to get closer or to keep distance.",
    "Whether you get to the point or take the scenic route.",
    "Whether you exaggerate for the story, and everyone knows it.",
    "The story you have told so many times it has its own rhythm.",
    "Whether you do the voices when you tell a story.",
    "Whether you talk with your hands.",
    "Whether you remember the punchline before you remember the setup.",
    "How your voice changes at work versus at home.",
    "The version of your voice you use when you are trying to be taken seriously.",
    "Whether you sound like yourself in writing.",
    "How you talk to children, and whether it is different from everyone else.",
    "The voice you use on the people you love most.",
    "Whether you are blunt or you cushion everything.",
    "The sound you make when you are thinking. A hum, an um, a clicked tongue.",
    "What your laugh actually sounds like.",
    "The thing your voice does when you lie, that you hope no one has noticed.",
    "Whether you trail off or finish every sentence.",
    "The phrase you use when you do not want to answer.",
    "Whether you say sorry too much, or never.",
    "The way you say someone's name when you are serious.",
    "The thing you say right before you tell the truth.",
    "Whether you mumble or enunciate every word.",
    "Whether you talk to yourself out loud, and what you say.",
    "Whether you talk to animals, and in what voice.",
    "How you sound first thing in the morning.",
    "Whether you over-explain or leave people to fill in the gaps.",
    "The accent or voice you do as an impression that everyone requests.",
    "Whether you narrate what you are doing while you do it.",
    "A saying of your grandparents' that lives in your mouth now.",
    "The phrase you hope your kids catch from you.",
    "The word that has changed meaning over your lifetime that you still use the old way.",
    "The way your family talks that you did not know was unusual until you left.",
    "Whether you have softened or sharpened your tongue with age.",
    "The thing you say so often it should be on your headstone.",
    "Whether you write the way you speak or become someone else on the page.",
    "The voicemail greeting you have, and whether it still sounds like you.",
    "How you sound when you read aloud.",
    "Whether you sing in the car, and whether anyone is allowed to hear.",
    "The pet name you use that you would deny in public.",
    "The way you say goodbye on the phone, and how long it takes.",
  ],
  "how-you-live": [
    "What mornings sounded like in the house you grew up in.",
    "The chore that was yours as a kid, and whether you did it.",
    "What bedtime looked like when you were small.",
    "The meal your family ate together, and the one no one showed up for.",
    "How your family spent a Sunday.",
    "The show, program, or sound that marked the time of day.",
    "What summer felt like as a child, hour to hour.",
    "The treat that was rationed, and the one that was endless.",
    "What your room looked like when no one was making you clean it.",
    "How you spent a Friday night at fifteen.",
    "The first thing you did when you got home from school.",
    "What you ate when no adult was watching.",
    "Whether you were up at dawn or impossible to wake.",
    "The way you wasted time before it was a phone.",
    "The first apartment routine you built for yourself.",
    "What you ate when you were broke and on your own.",
    "How you spent money you should have saved.",
    "The bad habit you picked up living alone.",
    "The first thing you do when you open your eyes.",
    "Whether you wake easily or fight it.",
    "What your coffee or tea ritual is, exactly.",
    "Whether mornings are sacred or survived.",
    "The order you do things in before you leave the house.",
    "What ruins a morning for you.",
    "Whether you check your phone before your feet hit the floor.",
    "The breakfast you have had ten thousand times.",
    "The work you do, and what an ordinary day of it looks like.",
    "Whether you are busiest in the morning or come alive at night.",
    "The part of your day you protect from everyone.",
    "How you take a break, or whether you do.",
    "What your desk, workspace, or kit looks like.",
    "The task you always put off, and the one you do first.",
    "Whether you eat lunch like it matters or at your desk.",
    "The commute, walk, or transition that bookends your working day.",
    "The meal you cook without a recipe.",
    "What is always in your fridge.",
    "Whether you eat to live or live to eat.",
    "The food you eat standing up, alone, with no one watching.",
    "The dish that is your whole personality at a dinner.",
    "How you take your eggs, your coffee, your steak.",
    "The restaurant or dish you order the same thing at every time.",
    "Whether you cook for others as love or as duty.",
    "What you do in the last hour before bed.",
    "Whether you sleep easily or negotiate with the ceiling.",
    "The side of the bed that is yours.",
    "What you fall asleep to. Silence, sound, a show, a person.",
    "Whether you are a night owl who wishes otherwise.",
    "The thing you do to wind down that actually works.",
    "What your bedroom says about you.",
    "Whether you dream, and whether you remember them.",
    "The ritual you have that would seem strange to an outsider.",
    "The thing you do every Sunday, or every year, without fail.",
    "A small daily ceremony that keeps you sane.",
    "The superstition you follow even though you do not believe it.",
    "The way you mark the start of a season.",
    "The annual tradition you would defend to the death.",
    "The thing you always do before a trip.",
    "The ritual you inherited and the one you invented.",
    "What your home smells like when you walk in.",
    "The room you actually live in, versus the one for show.",
    "The state of your home on a normal day. Honestly.",
    "The chore you find satisfying, and the one you avoid.",
    "What is on your kitchen counter right now.",
    "The corner of your home that is most you.",
    "Whether your space is full or spare.",
    "The thing in your home you would replace last.",
    "What you do with a free afternoon and no obligations.",
    "The hobby you are quietly serious about.",
    "What you do that has no point except that you love it.",
    "How you spend a vacation. Packed or empty.",
    "The thing you collect, on purpose or by accident.",
    "The way you move your body, or refuse to.",
    "What you do when you are alone and no one would know.",
    "The screen habit you have made peace with, and the one that you have not.",
    "What you spend money on without guilt.",
    "What you are cheap about.",
    "The thing you always buy the best version of.",
    "Whether you keep things or let them go.",
    "The purchase you think about more than you should.",
    "How you handle money you did not expect to have.",
    "The thing you own more of than any reasonable person needs.",
    "Whether you fix things or replace them.",
    "The way you take care of yourself when no one is checking.",
    "What you do when you are sick, and who you let near you.",
    "The grooming or self-care ritual you would not skip.",
    "The daily habit that has survived every version of your life.",
    "The routine you miss from an earlier chapter.",
    "The way your days have slowed down or sped up with age.",
    "The luxury you have grown into.",
    "The simple thing that reliably makes a day good.",
    "What a perfect ordinary day looks like for you now, hour by hour.",
    "What you do with the first hour you have entirely to yourself.",
    "The errand you find oddly satisfying.",
    "How you pack for a trip. Early and neat, or at the last minute.",
    "The chore you do to think, not just to clean.",
    "What sound fills your home most days. Music, talk, or silence.",
    "The way you take your weekends now versus how you wish you took them.",
    "The seasonal shift that changes your whole routine.",
    "The small daily indulgence you would not explain to anyone.",
    "The texture of daily life you most want remembered. The smell, the sound, the rhythm of it.",
  ],
  beliefs: [
    "What you were raised to believe about God, and where you have landed.",
    "The faith, or lack of it, you were handed as a child.",
    "The first rule of right and wrong you were taught.",
    "What your family believed about money, and whether you kept it.",
    "What you were taught about people who were different from you.",
    "The values that were spoken in your house, versus the ones that were actually lived.",
    "The prayer, grace, or words said in your home, if any.",
    "What you were taught happens when you die.",
    "The first belief you remember questioning.",
    "The age you started thinking for yourself about big things.",
    "A belief you held firmly at twenty that you have abandoned.",
    "The moment your faith, or your doubt, became your own rather than inherited.",
    "A teacher, book, or person who cracked something open in you.",
    "The first time you disagreed with your family about something that mattered.",
    "What you believe happens after death, in your own words.",
    "Whether you believe in something larger than yourself, and what you call it.",
    "What you do when you need to feel less alone in the universe.",
    "Whether you pray, meditate, or have your own version of it.",
    "What you believe about why we are here, if anything.",
    "The question about existence you have made peace with not answering.",
    "Whether suffering means anything, in your view.",
    "What you believe about fate, luck, and choice.",
    "The closest you have come to a spiritual experience.",
    "What sacred means to you, if the word still does.",
    "The line you will not cross, no matter the cost.",
    "A thing most people think is wrong that you do not.",
    "A thing most people accept that you think is wrong.",
    "The principle you would lose money, friends, or status to keep.",
    "What you believe about lying. When it is allowed, if ever.",
    "The difference, to you, between legal and right.",
    "Whether you believe people are basically good.",
    "What you think people owe each other.",
    "The moral question you are least sure about.",
    "The compromise you made that still sits wrong with you.",
    "The value you would put at the center of your life if you had to choose one.",
    "What you believe a person owes their family.",
    "What you believe you owe strangers.",
    "The thing you believe is worth more than money.",
    "What you think makes a life well lived.",
    "The value you are most afraid of losing in yourself.",
    "The principle you raise, or would raise, children by.",
    "What you believe about hard work and luck.",
    "Whether you believe in second chances, and how many.",
    "The thing you refuse to be cynical about.",
    "The thing you believe about luck that has shaped your choices.",
    "Whether you believe in evil, or only in harm.",
    "Whether you think the world is getting better or worse.",
    "What you believe about human nature.",
    "Whether you trust institutions or people.",
    "What you think the purpose of a country, or a community, is.",
    "Whether you believe in progress or in cycles.",
    "The thing you believe about money and power.",
    "What you think we are getting wrong as a society right now.",
    "Whether you think most people can change.",
    "The political belief you hold most strongly, and how you came to it.",
    "A political view you have changed your mind on.",
    "Whether you argue politics or keep the peace.",
    "The cause you would give time, not just money, to.",
    "What you believe about the responsibility of those who have to those who do not.",
    "The issue you cannot stay quiet about.",
    "Whether you vote with your heart, your wallet, or your conscience.",
    "The political belief you hold that your friends would be surprised by.",
    "A belief that has cost you something.",
    "The belief that held when everything else fell apart.",
    "A time your convictions were tested and you are proud of how you stood.",
    "A time you stayed silent when you should have spoken, and what you believe now.",
    "The belief you defended that you later realized was wrong.",
    "What you believe about forgiveness, at the level of principle.",
    "What you want to be true about death, whether or not you believe it.",
    "Whether you fear death, and what specifically.",
    "What you believe is left of a person after they are gone.",
    "What you want done with your body, and what that choice says about your beliefs.",
    "Whether you believe you will see the people you have lost again.",
    "What you believe a good death looks like.",
    "The thing you hope outlives you.",
    "What you believe gives a short life as much meaning as a long one.",
    "The belief you hold that you cannot fully defend.",
    "What you do with doubt when it comes.",
    "The thing you wish you believed but cannot.",
    "Whether certainty or doubt has served you better.",
    "The question you are still working out.",
    "What you believe is worth being hopeful about.",
    "The thing you have faith in that has nothing to do with religion.",
    "What you believe about the next generation.",
    "The future you believe is possible, even if unlikely.",
    "The belief you have held longest, unbroken.",
    "The belief you have flipped completely on.",
    "How your relationship with faith has moved across your life.",
    "The conviction you most want to pass down.",
    "The belief you hope your children abandon if it does not fit them.",
    "What you believe now that your younger self would argue with.",
    "The thing you were certain of at thirty that life has complicated.",
    "What you want said about what you stood for.",
    "The belief that has cost you the most, and whether it was worth it.",
    "Whether you have made peace with the things you cannot know.",
    "The thing you believe that you have never said out loud.",
    "What you hope people understand about why you believed what you did.",
    "The conviction you would want carved somewhere permanent.",
    "Whether you believe your life has mattered, and to whom.",
    "If you could be sure of one thing about the meaning of it all, what you would choose to know.",
  ],
  heart: [
    "The thing that makes you feel most alive.",
    "What you could talk about for hours and never tire of.",
    "The last time you felt pure joy, and what caused it.",
    "The kind of beauty that stops you in your tracks.",
    "The music that reaches a place nothing else does.",
    "The thing you love that you cannot fully explain to anyone.",
    "What you do that makes you lose track of time.",
    "The smell, sight, or sound that floods you with happiness.",
    "The people you love most, and what each one unlocks in you.",
    "The animal you have loved, and what it gave you that people could not.",
    "The place on earth you love most, and what it does to you.",
    "The thing you love that you are slightly embarrassed about.",
    "What you loved as a child that you still love now.",
    "The love that changed the shape of your life.",
    "The kind of love you find easiest to give.",
    "The kind of love you find hardest to receive.",
    "Whether you feel things on the surface or all the way down.",
    "The last thing that made you cry, and whether you let it.",
    "Whether you cry easily or it takes an earthquake.",
    "The emotion you are most comfortable with.",
    "The emotion you run from.",
    "Whether you feel other people's pain as your own.",
    "What you do with a feeling too big to hold.",
    "The feeling you wish you felt more often.",
    "The last time you felt awe.",
    "What still surprises you about being alive.",
    "The simple pleasure you would never give up.",
    "The thing that makes you laugh until you cannot breathe.",
    "The kind of joy you only feel alone.",
    "The kind of joy you only feel with others.",
    "What childhood wonder you have managed to keep.",
    "The moment of happiness you return to in your mind.",
    "The way you love when you are not afraid.",
    "What it costs you to love someone fully.",
    "Whether you love loudly or quietly.",
    "The person you love who has no idea how much.",
    "What you would sacrifice for the people you love, tested or not.",
    "The way your heart behaves when someone you love is in pain.",
    "What love has taught you that nothing else could.",
    "The love you have lost that still lives in you.",
    "The loss that broke your heart the most.",
    "How you carry the people you have lost.",
    "What grief taught you about love.",
    "The heartbreak you never fully recovered from, and made peace with anyway.",
    "What you do with longing for someone who is gone.",
    "The anniversary your heart keeps even when your calendar does not.",
    "Whether your heart has scar tissue, and where.",
    "The goodbye you never got to say.",
    "The hardest thing you have ever forgiven.",
    "The thing you cannot forgive, and whether you want to.",
    "Whether you forgive for them or for yourself.",
    "The person you need to forgive but have not.",
    "The thing you need to forgive yourself for.",
    "Whether your heart softens or hardens with time.",
    "The thing in people that you cannot abide.",
    "The sound, sight, or behavior that turns your stomach.",
    "The kind of cruelty that makes you furious.",
    "The injustice you cannot look away from.",
    "The small thing that bothers you out of all proportion.",
    "What makes you lose your temper, really.",
    "The thing people do that you take personally even when you should not.",
    "The kind of person you cannot warm to.",
    "What you find beautiful that others walk past.",
    "The piece of art, music, or writing that undoes you.",
    "The most beautiful thing you have ever seen with your own eyes.",
    "The kind of beauty in people that moves you more than looks.",
    "What you do when something is too beautiful to bear.",
    "The view, the season, the light you would choose to die looking at.",
    "The fear that sits underneath the other fears.",
    "What you are most tender about.",
    "The thing that makes your heart ache in a good way.",
    "What you protect most fiercely.",
    "The vulnerability you hide best.",
    "What makes you feel small in a way you do not mind.",
    "The kind of story that gets you every time.",
    "The act of kindness that stays with you, given or received.",
    "The thing strangers do that restores your faith in people.",
    "What moves you that you would never admit at a dinner party.",
    "The sentence someone said to you that you have never forgotten.",
    "The gesture that means more to you than any gift.",
    "What your heart wanted at twenty versus what it wants now.",
    "The thing you used to love that you have outgrown.",
    "The love that surprised you by lasting.",
    "The way heartbreak has made you, not broken you.",
    "What you have learned to let go of.",
    "What you will never let go of.",
    "The thing that has always made you cry, since you were small.",
    "The thing that has always made you laugh, since you were small.",
    "What you love most about your life right now.",
    "The person whose happiness matters as much to you as your own.",
    "What you are grateful for that you rarely say.",
    "The thing that brings you peace when nothing else does.",
    "What makes your chest tight with love when you least expect it.",
    "The beauty in your ordinary life that you do not want to take for granted.",
    "What you hope still moves you when you are old.",
    "The love you want to be remembered for.",
    "What you want the people you love to feel when they think of you.",
    "The thing you most want to say to the people you love before you cannot.",
    "The feeling you most want to leave behind in the people who knew you.",
    "If your heart could say one true thing to the person who will hear this, what it would be.",
  ],
};

type FieldKind = "text" | "date" | "place" | "language";

type FormFieldDef = {
  key: string;
  label: string;
  placeholder: string;
  hint?: string;
  kind: FieldKind;
  multi: boolean;
};

type DimFormDef = {
  subtitle: string;
  formGap?: number;   // gap between title block and form card; defaults to 50px
  col3Height?: number; // explicit height for save column so justify-between pins button to bottom
  col1: FormFieldDef[];
  col2: FormFieldDef[];
  col3: FormFieldDef[];
};

const DIMENSION_FORMS: Record<string, DimFormDef> = {
  history: {
    subtitle: "Where you come from. Who you come from.",
    col3Height: 667,
    col1: [
      { key: "full_name",      label: "Full name",        placeholder: "Your full name, exactly as you write it", kind: "text",     multi: false },
      { key: "goes_by",        label: "Goes by",          placeholder: "What people actually call you",           kind: "text",     multi: false },
      { key: "dob",            label: "Date of birth",    placeholder: "MM/DD/YYYY",                              kind: "date",     multi: false },
      { key: "place_of_birth", label: "Place of birth",   placeholder: "City, Country",                          kind: "place",    multi: false },
      { key: "where_from",     label: "Where you're from", placeholder: "Culture, ethnicity, the place that shaped you", kind: "text", multi: true },
      { key: "homes",          label: "Homes",            placeholder: "Where?",                                  kind: "place",    multi: true },
    ],
    col2: [
      { key: "parents",  label: "Parents",  placeholder: "Full name",  kind: "text", multi: true },
      { key: "siblings", label: "Siblings", placeholder: "Full name",  kind: "text", multi: true },
      { key: "partners", label: "Partners", placeholder: "Full name",  kind: "text", multi: true },
      { key: "children", label: "Children", placeholder: "Full name",  kind: "text", multi: true },
    ],
    col3: [
      { key: "languages", label: "Languages", placeholder: "Add a language", kind: "language", multi: true },
    ],
  },
  relationships: {
    subtitle: "How you are with the people in your life.",
    formGap: 30,
    col3Height: 330,
    col1: [
      { key: "relationship_status",  label: "Relationship status",    placeholder: "Your answer", hint: "e.g., single, married, partnered, it's complicated",                kind: "text", multi: false },
      { key: "how_show_love",        label: "How you show love",      placeholder: "Your answer", hint: "e.g., words, time, gifts, touch, showing up",                       kind: "text", multi: false },
      { key: "how_handle_conflict",  label: "How you handle conflict", placeholder: "Your answer", hint: "e.g., talk it out, walk away, sit with it, push through",         kind: "text", multi: false },
    ],
    col2: [
      { key: "stand_on_family",      label: "Where you stand on family",      placeholder: "Your answer", hint: "e.g., close, distant, complicated, chosen",                          kind: "text", multi: false },
      { key: "stand_on_friendship",  label: "Where you stand on friendship",  placeholder: "Your answer", hint: "e.g., close, distant, complicated, chosen",                          kind: "text", multi: false },
      { key: "how_in_groups",        label: "How you are in groups",          placeholder: "Your answer", hint: "e.g., quiet observer, the one telling the story, fade in and out",   kind: "text", multi: false },
    ],
    col3: [
      { key: "where_refuel", label: "Where you refuel", placeholder: "Your answer", hint: "e.g., alone, with one person, in a crowd, on a walk", kind: "text", multi: false },
    ],
  },
  "how-you-think": {
    subtitle: "The way your mind works.",
    col3Height: 521,
    col1: [
      { key: "mind_sharp_at",  label: "What your mind is sharp at",      placeholder: "Your answer", hint: "e.g., numbers, names, faces, directions, languages, patterns, big picture", kind: "text", multi: false },
      { key: "mind_struggles", label: "What your mind struggles with",   placeholder: "Your answer", hint: "e.g., remembering names, sitting still, abstract ideas, small talk",        kind: "text", multi: false },
      { key: "how_decide",     label: "How you make decisions",         placeholder: "Your answer", hint: "e.g., gut, pros and cons, ask people, sleep on it, decide fast",            kind: "text", multi: false },
      { key: "memory_works",   label: "How your memory works",          placeholder: "Your answer", hint: "e.g., conversations word for word, feelings over facts, faces not names",   kind: "text", multi: false },
    ],
    col2: [
      { key: "how_focus",   label: "How you focus",                       placeholder: "Your answer", hint: "e.g., one thing at a time, easily distracted, deep dives",         kind: "text", multi: false },
      { key: "how_picture", label: "How you picture things in your head", placeholder: "Your answer", hint: "e.g., in words, in images, other, not at all",                      kind: "text", multi: false },
      { key: "keep_sharp",  label: "How you keep your mind sharp",        placeholder: "Your answer", hint: "e.g., crosswords, mahjong, reading, learning a language, debate",  kind: "text", multi: false },
    ],
    col3: [
      { key: "read_watch",    label: "What you read or watch", placeholder: "Your answer", hint: "e.g., literary fiction, sci-fi, history, biographies, documentaries, the news", kind: "text", multi: false },
      { key: "sense_of_time", label: "Your sense of time",     placeholder: "Your answer", hint: "e.g., always early, always late, lose track of it",                            kind: "text", multi: false },
    ],
  },
  "how-you-talk": {
    subtitle: "What people hear when you speak.",
    col3Height: 376,
    col1: [
      { key: "accent",  label: "Your accent", placeholder: "Your answer", hint: "e.g., New York at home, neutral at work",                        kind: "text", multi: false },
      { key: "pace",    label: "Your pace",   placeholder: "Your answer", hint: "e.g., usually fast, slower when I'm being careful",              kind: "text", multi: false },
      { key: "volume",  label: "Your volume", placeholder: "Your answer", hint: "e.g., loud by default, quiet in rooms I don't know",             kind: "text", multi: false },
    ],
    col2: [
      { key: "humor",    label: "Your kind of humor", placeholder: "Your answer", hint: "e.g., dry, dark, depends on the room",                                                kind: "text", multi: false },
      { key: "swearing", label: "How you swear",      placeholder: "Your answer", hint: "e.g., constantly, only when driving, in another language, never",                     kind: "text", multi: false },
    ],
    col3: [
      { key: "words_say_a_lot",  label: "Words you say a lot",   placeholder: "Your answer", hint: 'e.g., honestly, mashallah, oof',                kind: "text", multi: false },
      { key: "words_never_say",  label: "Words you never say",   placeholder: "Your answer", hint: 'e.g., "literally", clichés, anything corny',    kind: "text", multi: false },
    ],
  },
  "how-you-live": {
    subtitle: "What your days are made of.",
    col3Height: 619,
    col1: [
      { key: "mornings", label: "Your mornings",  placeholder: "Your answer", hint: "e.g., up at five, slow with coffee, hit snooze three times",                      kind: "text", multi: true },
      { key: "evenings", label: "Your evenings",  placeholder: "Your answer", hint: "e.g., long dinners, in bed by nine, restless until midnight",                     kind: "text", multi: true },
      { key: "sleep",    label: "How you sleep",  placeholder: "Your answer", hint: "e.g., light sleeper, deep, never enough, weird dreams",                          kind: "text", multi: false },
      { key: "eat",      label: "What you eat",   placeholder: "Your answer", hint: "e.g., the same things on repeat, big home cooked meals, takeout, picky",         kind: "text", multi: true },
    ],
    col2: [
      { key: "free_time", label: "How you spend free time",     placeholder: "Your answer", hint: "e.g., outside, with people, alone with a book, in the kitchen",                          kind: "text", multi: true },
      { key: "work",      label: "What you've done for work",   placeholder: "Your answer", hint: "e.g., teacher for thirty years, ran a small business, raising kids, retired",             kind: "text", multi: true },
      { key: "rituals",   label: "Your rituals over the years", placeholder: "Your answer", hint: "e.g., Sunday calls with mom, Friday prayers, morning coffee alone",                       kind: "text", multi: true },
    ],
    col3: [
      { key: "home_feels",   label: "What your home feels like",  placeholder: "Your answer", hint: "e.g., quiet, full of books, always something cooking", kind: "text", multi: false },
      { key: "spend_money",  label: "What you spend money on",    placeholder: "Your answer", hint: "e.g., travel, books, the people I love",               kind: "text", multi: true },
    ],
  },
  beliefs: {
    subtitle: "What you hold without apology.",
    col3Height: 667,
    col1: [
      { key: "faith",           label: "Your faith",                    placeholder: "Your answer", hint: "e.g., Muslim, Catholic, spiritual but not religious, none",                             kind: "text", multi: false },
      { key: "how_practice",    label: "How you practice it",           placeholder: "Your answer", hint: "e.g., prayer, fasting, service, meditation, holidays only, not at all",                 kind: "text", multi: false },
      { key: "politics",        label: "Your politics",                 placeholder: "Your answer", hint: "e.g., left, right, complicated, I don't talk about it",                                 kind: "text", multi: false },
      { key: "believe_people",  label: "What you believe about people", placeholder: "Your answer", hint: "e.g., mostly good, capable of anything, you have to earn my trust",                     kind: "text", multi: true },
      { key: "believe_life",    label: "What you believe about life",   placeholder: "Your answer", hint: "e.g., we make our own meaning, everything happens for a reason",                        kind: "text", multi: true },
    ],
    col2: [
      { key: "stand_for",       label: "What you stand for",                  placeholder: "Your answer", hint: "e.g., honesty, loyalty, hard work, family first",                                kind: "text", multi: true },
      { key: "wont_compromise", label: "What you won't compromise on",        placeholder: "Your answer", hint: "e.g., my kids, my faith, telling the truth, my time",                            kind: "text", multi: true },
      { key: "believe_death",   label: "What you believe happens when we die", placeholder: "Your answer", hint: "e.g., heaven, nothing, something we can't know, we live on in others",         kind: "text", multi: false },
    ],
    col3: [
      { key: "believe_right",  label: "What you believe is right", placeholder: "Your answer", hint: "e.g., treating people well, telling the truth, doing the work",  kind: "text", multi: true },
      { key: "believe_wrong",  label: "What you believe is wrong", placeholder: "Your answer", hint: "e.g., cruelty, dishonesty, taking what isn't yours",              kind: "text", multi: true },
    ],
  },
  heart: {
    subtitle: "What you love, and how.",
    col3Height: 667,
    col1: [
      { key: "how_love",        label: "How you love",               placeholder: "Your answer", hint: "e.g., hard and fast, slow to start, forever once I do, all in",       kind: "text", multi: false },
      { key: "how_forgive",     label: "How you forgive",            placeholder: "Your answer", hint: "e.g., easily, never, after time, only when it's earned",               kind: "text", multi: false },
      { key: "how_deeply_feel", label: "How deeply you feel",        placeholder: "Your answer", hint: "e.g., loud and visible, deep but quiet, intensely, hard to access",    kind: "text", multi: false },
      { key: "how_express",     label: "How you express what's inside", placeholder: "Your answer", hint: "e.g., words, music, painting, cooking, building, in silence",      kind: "text", multi: true },
      { key: "things_love",     label: "Things you love",            placeholder: "Your answer", hint: "e.g., the ocean, jazz, the smell of rain, a long drive",               kind: "text", multi: true },
    ],
    col2: [
      { key: "who_love",       label: "Who you love",           placeholder: "Your answer", hint: "e.g., your kids, your dog, your oldest friend",                                               kind: "text", multi: true },
      { key: "find_beautiful", label: "What you find beautiful", placeholder: "Your answer", hint: "e.g., old buildings, your grandmother's handwriting, the desert, hands",                     kind: "text", multi: true },
      { key: "makes_laugh",    label: "What makes you laugh",   placeholder: "Your answer", hint: "e.g., your kids, slapstick, the way your partner tells stories",                              kind: "text", multi: true },
    ],
    col3: [
      { key: "cant_stand", label: "What you can't stand", placeholder: "Your answer", hint: "e.g., cruelty, small talk, slow walkers, dishonesty", kind: "text", multi: true },
    ],
  },
};

type Entry = { id: string; title?: string; body: string; entry_type: string; tags?: EntryTags; media_s3_key?: string | null; duration_s?: number | null; created_at: string };
type DimData = { id: string; slug: string; structured: Record<string, unknown> | null; entries: Entry[] };

const FOOTER_H = 103;
const BAR_H = 70;

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FormFieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.kind === "place") {
    return <Typeahead value={value} onChange={onChange} options={PLACES} placeholder={field.placeholder} />;
  }
  if (field.kind === "language") {
    return <Typeahead value={value} onChange={onChange} options={LANGUAGES} placeholder={field.placeholder} />;
  }
  if (field.kind === "date") {
    const invalid = value.length > 0 && !isValidMMDDYYYY(value);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <input
          value={value}
          inputMode="numeric"
          onChange={e => onChange(maskMMDDYYYY(e.target.value))}
          placeholder={field.placeholder}
          style={{
            width: "100%", height: "57px", padding: "0 10px",
            borderRadius: "10px", border: `1px solid ${invalid ? "#c0392b" : DARK_GREY}`,
            fontFamily: sans, fontSize: "14px", boxSizing: "border-box",
            background: "white", color: BLACK,
          }}
        />
        {invalid && <span style={{ fontFamily: sans, fontSize: "12px", color: "#c0392b", fontStyle: "oblique" }}>Use MM/DD/YYYY (e.g. 04/14/1990).</span>}
      </div>
    );
  }
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder}
      style={{
        width: "100%", height: "57px", padding: "0 10px",
        borderRadius: "10px", border: `1px solid ${DARK_GREY}`,
        fontFamily: sans, fontSize: "14px", boxSizing: "border-box",
        background: "white", color: BLACK,
      }}
    />
  );
}

function FormColumn({
  fields,
  form,
  setField,
  isSaveCol,
  onSave,
  saving,
  height,
}: {
  fields: FormFieldDef[];
  form: Record<string, string | string[]>;
  setField: (key: string, val: string | string[]) => void;
  isSaveCol?: boolean;
  onSave?: () => void;
  saving?: boolean;
  height?: number;
}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: isSaveCol ? "space-between" : "flex-start",
      gap: "20px",
      width: "400px",
      flexShrink: 0,
      ...(isSaveCol && height ? { height: `${height}px` } : {}),
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {fields.map(field => {
          const raw = form[field.key];
          if (field.multi) {
            const arr = (raw as string[] | undefined) ?? [];
            const displayArr = arr.length > 0 ? arr : [""];
            return (
              <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>{field.label}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {displayArr.map((item, idx) => (
                    <FieldInput
                      key={idx}
                      field={field}
                      value={item}
                      onChange={v => {
                        const next = [...displayArr];
                        next[idx] = v;
                        setField(field.key, next);
                      }}
                    />
                  ))}
                </div>
                {field.hint && (
                  <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "12px", color: "#444" }}>{field.hint}</span>
                )}
                <button
                  onClick={() => {
                    const next = [...displayArr, ""];
                    setField(field.key, next);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "none", border: "none", cursor: "pointer",
                    padding: "0 10px",
                  }}
                >
                  <span style={{ fontFamily: sans, fontSize: "22px", color: BLACK, lineHeight: 1 }}>+</span>
                  <span style={{ fontFamily: sans, fontSize: "16px", color: DARK_GREY }}>Add more</span>
                </button>
              </div>
            );
          }
          return (
            <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "16px", color: "#444" }}>{field.label}</span>
              <FieldInput
                field={field}
                value={(raw as string) ?? ""}
                onChange={v => setField(field.key, v)}
              />
              {field.hint && (
                <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "12px", color: "#444" }}>{field.hint}</span>
              )}
            </div>
          );
        })}
      </div>

      {isSaveCol && onSave && (
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            width: "304px", height: "48px",
            background: BLACK,
            borderRadius: "8px", border: "none",
            fontFamily: sans, fontWeight: 700, fontSize: "16px",
            color: FOOTER_TEXT,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            alignSelf: "flex-end",
          }}
        >
          {saving ? "Saving…" : "Save and continue →"}
        </button>
      )}
    </div>
  );
}

function DimensionForm({
  contractId,
  dimension,
  dim,
  formDef,
  initialStructured,
  makerFirstName,
  onSaved,
}: {
  contractId: string;
  dimension: string;
  dim: typeof DIMENSIONS[number];
  formDef: DimFormDef;
  initialStructured: Record<string, unknown> | null;
  makerFirstName: string;
  onSaved: (structured: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState<Record<string, string | string[]>>(() => {
    if (!initialStructured) return {};
    const out: Record<string, string | string[]> = {};
    for (const [k, v] of Object.entries(initialStructured)) {
      out[k] = Array.isArray(v) ? (v as string[]) : String(v);
    }
    return out;
  });
  const [saving, setSaving] = useState(false);

  function setField(key: string, value: string | string[]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const cleaned: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(form)) {
        if (Array.isArray(v)) {
          const filtered = v.filter(s => s.trim());
          if (filtered.length) cleaned[k] = filtered;
        } else if (typeof v === "string" && v.trim()) {
          cleaned[k] = v;
        }
      }
      await api.upsertDimension(contractId, dimension, cleaned);
      onSaved(cleaned);
    } finally {
      setSaving(false);
    }
  }

  // Save button always goes in the rightmost non-empty column
  const saveColIdx = formDef.col3.length > 0 ? 2 : formDef.col2.length > 0 ? 1 : 0;
  const allCols = [formDef.col1, formDef.col2, formDef.col3];

  return (
    <div style={{ paddingLeft: "108px", paddingTop: "31px", paddingBottom: "60px", width: "1700px" }}>
      {/* Back link */}
      <BackLink href="/contracts" label="Your contracts" marginBottom="30px" />

      {/* Title + subtitle */}
      <div style={{ marginBottom: `${formDef.formGap ?? 50}px` }}>
        <h1 style={{
          fontFamily: serif, fontStyle: "italic", fontWeight: 400,
          fontSize: "64px", color: BLACK, margin: "0 0 10px",
        }}>
          {dim.label}
        </h1>
        <p style={{
          fontFamily: sans, fontStyle: "oblique", fontSize: "22px",
          color: BLACK, margin: 0,
        }}>
          {formDef.subtitle}
        </p>
      </div>

      {/* Form card */}
      <div style={{
        background: "white",
        border: `1px solid ${CREAM_STROKE}`,
        borderRadius: "20px",
        padding: "40px 60px",
        display: "flex",
        justifyContent: "space-between",
      }}>
        {allCols.map((fields, colIdx) => (
          fields.length > 0 || colIdx === saveColIdx ? (
            <FormColumn
              key={colIdx}
              fields={fields}
              form={form}
              setField={setField}
              isSaveCol={colIdx === saveColIdx}
              onSave={colIdx === saveColIdx ? handleSave : undefined}
              saving={saving}
              height={colIdx === saveColIdx ? formDef.col3Height : undefined}
            />
          ) : null
        ))}
      </div>
    </div>
  );
}

const WAVE_BARS = 24;

function TagChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      background: LAVENDER_FILL, color: LAVENDER,
      fontFamily: sans, fontSize: "14px", padding: "5px 14px", borderRadius: "999px",
    }}>
      {label}
      <button onClick={onRemove} style={{ background: "none", border: "none", color: LAVENDER, cursor: "pointer", fontSize: "15px", lineHeight: 1, padding: 0, display: "flex", alignItems: "center" }}>×</button>
    </span>
  );
}

function SField({ label, value, onChange, hint, id }: { label: string; value: string; onChange: (v: string) => void; hint: string; id?: string }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "12px", color: DARK_GREY, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      <input id={id} value={value} onChange={e => onChange(e.target.value)} style={{ height: "57px", padding: "0 12px", border: `1px solid ${DARK_GREY}`, borderRadius: "10px", fontFamily: sans, fontSize: "15px", width: "100%", boxSizing: "border-box" as const }} />
      <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "12px", color: DARK_GREY }}>{hint}</span>
    </div>
  );
}

function addTagBtnStyle(): CSSProperties {
  return { fontFamily: sans, fontSize: "12px", color: LIGHT_GREY, background: "white", border: `0.5px solid ${LIGHT_GREY}`, height: "30px", padding: "0 14px", cursor: "pointer" };
}

const CAROUSEL_SIZES = [
  { fontSize: "16.5px", color: LIGHT_GREY },
  { fontSize: "21.45px", color: DARK_GREY },
  { fontSize: "26.4px", color: BLACK },
  { fontSize: "21.45px", color: DARK_GREY },
  { fontSize: "16.5px", color: LIGHT_GREY },
];

function PromptCarousel({ questions, idx, onRotate }: { questions: string[]; idx: number; onRotate: () => void }) {
  const n = questions.length;
  const visible = [-2, -1, 0, 1, 2].map(offset => questions[((idx + offset) % n + n) % n]);
  return (
    <div onClick={onRotate} style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: "33px", cursor: "pointer", padding: "0 115px", boxSizing: "border-box",
    }}>
      {visible.map((q, i) => (
        <p key={i} style={{
          fontFamily: sans, fontStyle: "oblique",
          fontSize: CAROUSEL_SIZES[i].fontSize, color: CAROUSEL_SIZES[i].color,
          textAlign: "center", margin: 0, lineHeight: "normal", width: "100%",
        }}>{q}</p>
      ))}
    </div>
  );
}

function EntryEditView({
  entry,
  onSave,
  onTagsChange,
  onClose,
  saving,
  contractId,
  slug,
}: {
  entry: Entry;
  onSave: (patch: { title: string; body: string; tags: EntryTags }) => void;
  onTagsChange: (tags: EntryTags) => void;
  onClose: () => void;
  saving: boolean;
  contractId: string;
  slug: string;
}) {
  const [title, setTitle] = useState(entry.title ?? "");
  const [body, setBody] = useState(entry.body);
  const [people, setPeople] = useState<string[]>(entry.tags?.people ?? []);
  const [year, setYear] = useState(entry.tags?.year ?? "");
  const [place, setPlace] = useState(entry.tags?.place ?? "");
  const [callThem, setCallThem] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatHappened, setWhatHappened] = useState(entry.tags?.what_happened ?? "");
  const [when, setWhen] = useState(entry.tags?.when ?? "");
  const [editingBody, setEditingBody] = useState(false);
  const [addingField, setAddingField] = useState<"person" | "year" | "place" | null>(null);
  const [addingValue, setAddingValue] = useState("");
  const skipCommitRef = useRef(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const isVoice = entry.entry_type === "voice";
  const created = new Date(entry.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const durationLabel = isVoice && entry.duration_s != null
    ? `${Math.floor(entry.duration_s / 60)}:${String(entry.duration_s % 60).padStart(2, "0")}`
    : null;

  useEffect(() => {
    if (isVoice && entry.media_s3_key) {
      api.getEntryMediaUrl(contractId, slug, entry.id).then(r => setMediaUrl(r.url)).catch(() => setMediaUrl(null));
    }
  }, [isVoice, entry.media_s3_key, entry.id, contractId, slug]);

  // Both structured-prompt rows save the whole entry (per Figma 2182:7663,
  // each row ends in the same "Save" button, not a separate "add" step) —
  // so a name typed into "Someone worth naming?" must be captured here
  // directly rather than via a stale `people` state read.
  function handleSave() {
    const name = (fullName || callThem).trim();
    const finalPeople = name && !people.some(p => p.toLowerCase() === name.toLowerCase())
      ? [...people, name]
      : people;
    const y = /\b(\d{4})\b/.exec(when)?.[1] ?? year;
    onSave({
      title: (title.trim() || whatHappened.trim()),
      body,
      tags: {
        people: finalPeople, year: y || null, place: place.trim() || null,
        what_happened: whatHappened.trim() || null, when: when.trim() || null,
      },
    });
  }

  // Quick tags (chips + Add Person/Year/Place) persist immediately — each
  // add/remove fires its own save, independent of the big bottom Save button.
  function quickTags(overrides: Partial<{ people: string[]; year: string; place: string }>): EntryTags {
    return {
      people: overrides.people ?? people,
      year: (overrides.year ?? year) || null,
      place: (overrides.place ?? place) || null,
      what_happened: whatHappened.trim() || null,
      when: when.trim() || null,
    };
  }

  function startAdding(field: "person" | "year" | "place") {
    skipCommitRef.current = false;
    setAddingField(field);
    setAddingValue("");
  }

  function cancelAdding() {
    skipCommitRef.current = true;
    setAddingField(null);
    setAddingValue("");
  }

  function commitAdding() {
    if (skipCommitRef.current) { skipCommitRef.current = false; return; }
    const v = addingValue.trim();
    setAddingField(null);
    setAddingValue("");
    if (!v) return;
    if (addingField === "person") {
      if (people.some(p => p.toLowerCase() === v.toLowerCase())) return;
      const next = [...people, v];
      setPeople(next);
      onTagsChange(quickTags({ people: next }));
    } else if (addingField === "year") {
      setYear(v);
      onTagsChange(quickTags({ year: v }));
    } else if (addingField === "place") {
      setPlace(v);
      onTagsChange(quickTags({ place: v }));
    }
  }

  function removePerson(i: number) {
    const next = people.filter((_, j) => j !== i);
    setPeople(next);
    onTagsChange(quickTags({ people: next }));
  }
  function removeYear() {
    setYear("");
    onTagsChange(quickTags({ year: "" }));
  }
  function removePlace() {
    setPlace("");
    onTagsChange(quickTags({ place: "" }));
  }

  const allTags: Array<{ label: string; remove: () => void }> = [
    ...people.map((p, i) => ({ label: p, remove: () => removePerson(i) })),
    ...(year ? [{ label: year, remove: removeYear }] : []),
    ...(place ? [{ label: place, remove: removePlace }] : []),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <style>{`
        .entry-title-input::placeholder, .entry-body-textarea::placeholder { color: ${LIGHT_GREY}; font-style: italic; font-weight: 400; }
      `}</style>
      {/* ENTRY label */}
      <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: LAVENDER, margin: 0, letterSpacing: "0.03em" }}>ENTRY</p>

      {/* Entry card — per Figma 2182:7663/2182:7611, the top content AND the
          two structured rows below live in ONE continuous white bordered
          card, not a separate floating section. */}
      <div style={{ background: "white", border: `1px solid ${CREAM_STROKE}`, borderRadius: "15px", padding: "30px 50px 36px", display: "flex", flexDirection: "column", gap: "36px" }}>
        <div>
          {/* Header row: title/meta/tags + close */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div style={{ flex: 1, paddingRight: "24px" }}>
              <input className="entry-title-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={{
                fontFamily: sans, fontWeight: 700, fontSize: "20px", color: BLACK,
                border: "none", background: "transparent", outline: "none",
                width: "100%", padding: 0, marginBottom: "6px", display: "block",
              }} />
              <p style={{ fontFamily: sans, fontSize: "16px", color: DARK_GREY, margin: "0 0 12px" }}>
                {isVoice ? "Voice" : "Text"} • {created}{durationLabel ? ` • ${durationLabel}` : ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "10px" }}>
                {allTags.length > 0
                  ? allTags.map((t, i) => <TagChip key={i} label={t.label} onRemove={t.remove} />)
                  : <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "14px", color: LIGHT_GREY }}>No tags yet — add them below.</span>
                }
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {addingField === "person" ? (
                  <input autoFocus value={addingValue} onChange={e => setAddingValue(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") cancelAdding(); }}
                    onBlur={commitAdding} placeholder="Name" style={{ ...addTagBtnStyle(), width: "140px" }} />
                ) : (
                  <button onClick={() => startAdding("person")} style={addTagBtnStyle()}>+ Add Person</button>
                )}
                {addingField === "year" ? (
                  <input autoFocus value={addingValue} onChange={e => setAddingValue(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") cancelAdding(); }}
                    onBlur={commitAdding} placeholder="Year" style={{ ...addTagBtnStyle(), width: "100px" }} />
                ) : (
                  <button onClick={() => startAdding("year")} style={addTagBtnStyle()}>+ Add Year</button>
                )}
                {addingField === "place" ? (
                  <input autoFocus value={addingValue} onChange={e => setAddingValue(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") cancelAdding(); }}
                    onBlur={commitAdding} placeholder="City, Country" style={{ ...addTagBtnStyle(), width: "160px" }} />
                ) : (
                  <button onClick={() => startAdding("place")} style={addTagBtnStyle()}>+ Add Place</button>
                )}
              </div>
            </div>
            {/* Small × close */}
            <button onClick={onClose} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: sans, fontSize: "22px", color: DARK_GREY, lineHeight: 1,
              padding: "0 4px", flexShrink: 0,
            }}>×</button>
          </div>

          {/* Body / Playback */}
          {isVoice ? (
            <div style={{ background: "rgba(247,244,239,0.5)", borderRadius: "12px", padding: "20px 30px" }}>
              {mediaUrl ? (
                <audio controls src={mediaUrl} style={{ width: "100%", marginBottom: "12px" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "60px", marginBottom: "12px" }}>
                  {Array.from({ length: 70 }).map((_, i) => {
                    const h = 8 + Math.abs(Math.sin(i * 0.5 + 1) * Math.cos(i * 0.3)) * 44;
                    return <div key={i} style={{ width: "5px", height: `${h}px`, background: `rgba(106,77,125,${0.2 + Math.abs(Math.sin(i * 0.4)) * 0.5})`, borderRadius: "2px", flexShrink: 0 }} />;
                  })}
                </div>
              )}
              <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "14px", color: DARK_GREY, margin: 0 }}>
                Voice recording — to change this entry, delete it and re-record.
              </p>
            </div>
          ) : (
            <div style={{ position: "relative", background: "rgba(247,244,239,0.5)", borderRadius: "12px", padding: "20px 30px", minHeight: "120px" }}>
              <button onClick={() => setEditingBody(b => !b)} style={{
                position: "absolute", top: "12px", right: "12px",
                background: "none", border: "none", cursor: "pointer",
                color: LAVENDER, fontSize: "17px", lineHeight: 1, padding: "2px",
              }}>✎</button>
              {editingBody ? (
                <textarea className="entry-body-textarea" value={body} onChange={e => setBody(e.target.value)} autoFocus style={{
                  width: "100%", minHeight: "100px", border: "none", background: "transparent",
                  fontFamily: sans, fontSize: "14px", lineHeight: "1.7", resize: "vertical",
                  outline: "none", boxSizing: "border-box", color: BLACK,
                }} />
              ) : (
                <p style={{ fontFamily: sans, fontSize: "14px", color: BLACK, lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap", paddingRight: "28px" }}>
                  {body || <span style={{ color: LIGHT_GREY, fontStyle: "oblique" }}>Click ✎ to edit</span>}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Structured forms — inside the same card per Figma */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "18px", color: BLACK, margin: 0 }}>Someone worth naming?</p>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
            <SField id="edit-call-them" label="WHAT YOU CALL THEM" value={callThem} onChange={setCallThem} hint="Mum • Auntie N • Whatever you actually say" />
            <SField label="FULL NAME" value={fullName} onChange={setFullName} hint="First and last, if you know it." />
            {/* Per Figma 2185:8967, this slot is an empty placeholder (no visible
                button) — only the row below has the real Save button. Kept as
                a same-sized spacer so both rows' fields stay column-aligned. */}
            <div style={{ width: "204px", height: "57px", flexShrink: 0 }} />
          </div>

          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "18px", color: BLACK, margin: 0 }}>A time that mattered?</p>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
            <SField label="WHAT HAPPENED" value={whatHappened} onChange={setWhatHappened} hint="Born · Moved · Married · A child arrived · Someone left" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontFamily: sans, fontWeight: 700, fontSize: "12px", color: DARK_GREY, textTransform: "uppercase", letterSpacing: "0.04em" }}>WHEN</label>
              <input value={when} onChange={e => { setWhen(e.target.value); const y = /\b(\d{4})\b/.exec(e.target.value)?.[1]; if (y) setYear(y); }} style={{ height: "57px", padding: "0 12px", border: `1px solid ${DARK_GREY}`, borderRadius: "10px", fontFamily: sans, fontSize: "15px", width: "100%", boxSizing: "border-box" as const }} />
              <span style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "12px", color: DARK_GREY }}>A day, a month, a year, or a span. e.g. 2003 · 2015 to 2019</span>
            </div>
            <button onClick={handleSave} disabled={saving} style={{
              width: "204px", height: "57px", flexShrink: 0,
              background: saving ? "#b0a0c0" : LAVENDER, border: "none", borderRadius: "8px",
              fontFamily: sans, fontWeight: 700, fontSize: "17px", color: "white",
              cursor: saving ? "not-allowed" : "pointer",
            }}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildProse(slug: string, structured: Record<string, string | string[]>): string {
  if (Object.keys(structured).length === 0) return "";
  if (slug === "history") {
    const parts: string[] = [];
    if (structured.full_name) parts.push(String(structured.full_name));
    const dob = structured.dob ? `Born ${structured.dob}` : "";
    const pob = structured.place_of_birth ? `in ${String(structured.place_of_birth)}` : "";
    if (dob || pob) parts.push([dob, pob].filter(Boolean).join(" "));
    if (structured.where_from) {
      const wf = Array.isArray(structured.where_from) ? structured.where_from.filter(Boolean).join(", ") : String(structured.where_from);
      if (wf) parts.push(`From ${wf}`);
    }
    for (const g of [{ key: "parents", label: "Parents" }, { key: "siblings", label: "Siblings" }, { key: "partners", label: "Partners" }, { key: "children", label: "Children" }]) {
      const v = structured[g.key];
      if (v) {
        const names = Array.isArray(v) ? v.filter(Boolean).join(", ") : String(v);
        if (names) parts.push(`${g.label}: ${names}`);
      }
    }
    if (structured.languages) {
      const l = Array.isArray(structured.languages) ? structured.languages.filter(Boolean).join(", ") : String(structured.languages);
      if (l) parts.push(`Languages: ${l}`);
    }
    const prose = parts.join(" · ");
    const homes = structured.homes;
    const homeLine = homes ? (Array.isArray(homes) ? homes.filter(Boolean) : [String(homes)]).join(" → ") : "";
    return prose + (homeLine ? `\n${homeLine}` : "");
  }
  const formDef = DIMENSION_FORMS[slug];
  if (!formDef) return "";
  const allFields = [...formDef.col1, ...formDef.col2, ...formDef.col3];
  return allFields
    .filter(f => structured[f.key])
    .slice(0, 6)
    .map(f => {
      const v = structured[f.key];
      const str = Array.isArray(v) ? v.filter(Boolean).join(", ") : String(v);
      return str ? `${f.label}: ${str}` : "";
    })
    .filter(Boolean)
    .join(" · ");
}

function EntriesView({
  contractId,
  dim,
  data,
  initial,
  makerFirstName,
  onEntryAdded,
  onEntryDeleted,
  onEntryUpdated,
  onEditStructured,
}: {
  contractId: string;
  dim: typeof DIMENSIONS[number];
  data: DimData;
  initial: string;
  makerFirstName: string;
  onEntryAdded: (e: Entry) => void;
  onEntryDeleted: (id: string) => void;
  onEntryUpdated: (e: Entry) => void;
  onEditStructured: () => void;
}) {
  const prompts = PROMPTS[dim.slug] ?? [];
  const [promptIdx, setPromptIdx] = useState(0);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Voice-entry stage: idle (only Record enabled) → recording (only Stop
  // enabled) → recorded (only Save enabled). Stopping and saving are two
  // separate, deliberate user actions — stopping never auto-saves.
  const voiceStage: "idle" | "recording" | "recorded" = recording ? "recording" : recordedBlob ? "recorded" : "idle";

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      setRecording(true);
      setRecordSeconds(0);
      timerRef.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    } catch (err) {
      console.error("Mic error:", err);
    }
  }

  function stopRecordingAsync(): Promise<Blob> {
    return new Promise(resolve => {
      const mr = mediaRecorderRef.current;
      if (!mr) { resolve(new Blob()); return; }
      mr.onstop = () => resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
      mr.stop();
      mr.stream?.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      setRecording(false);
    });
  }

  async function stopRecording() {
    const blob = await stopRecordingAsync();
    setRecordedBlob(blob);
  }

  // Per Figma 2095:6746 ("...voice entry in"), saving does NOT open the entry
  // editor — the page returns to the ENTRIES list with the composer reset to
  // its idle default (Voice mode, carousel showing), not the just-saved entry.
  // Both text and voice: Save opens the entry editor immediately (Figma path
  // 2062:1016 → 2182:7663 for text, confirmed the same shape applies to
  // voice). For text, AI triangulation already ran server-side (synchronous
  // Haiku call), so the editor shows the real title/tags right away. For
  // voice, transcription + tagging is async (a separate worker) — the editor
  // opens with the placeholder title ("Voice note") and empty tags, which
  // get filled in later once that worker finishes. Composer only resets to
  // idle Voice+carousel once the editor itself is saved/closed (see saveEdit
  // and the onClose handler below) — not at this step.
  async function handleSave() {
    if (mode === "text") {
      if (!body.trim()) return;
      setSaving(true);
      try {
        const e = await api.addDimensionEntry(contractId, dim.slug, { body: body.trim(), entry_type: "text" });
        onEntryAdded(e as Entry);
        setBody("");
        setEditing(e as Entry);
      } finally { setSaving(false); }
    } else {
      if (!recordedBlob || recordSeconds < 10) return;
      setSaving(true);
      const secs = recordSeconds;
      try {
        const { presigned_url, s3_key } = await api.getEntryMediaPresigned(contractId, dim.slug);
        await fetch(presigned_url, { method: "PUT", body: recordedBlob, headers: { "Content-Type": "audio/webm" } });
        const e = await api.addDimensionEntry(contractId, dim.slug, {
          body: "",
          entry_type: "voice",
          title: "Voice note",
          media_s3_key: s3_key,
          duration_s: secs,
        });
        onEntryAdded(e as Entry);
        setRecordSeconds(0);
        setRecordedBlob(null);
        setEditing(e as Entry);
      } finally { setSaving(false); }
    }
  }

  // Closing the editor (via its own Save, or the × close) is the point where
  // the page returns to the ENTRIES list per Figma 2062:1195 — composer
  // resets to idle Voice+carousel here, not at the composer-save step.
  async function saveEdit(patch: { title: string; body: string; tags: EntryTags }) {
    if (!editing) return;
    setSavingEdit(true);
    try {
      const e = await api.updateDimensionEntry(contractId, dim.slug, editing.id, patch);
      onEntryUpdated(e as Entry);
      setEditing(null);
      setMode("voice");
    } finally { setSavingEdit(false); }
  }

  // Quick tags (chips + Add Person/Year/Place) save immediately, independent
  // of the big bottom Save button — each add/remove is its own PUT.
  async function saveQuickTags(entryId: string, tags: EntryTags) {
    const e = await api.updateDimensionEntry(contractId, dim.slug, entryId, { tags });
    onEntryUpdated(e as Entry);
  }

  async function deleteEntry(id: string) {
    setDeletingId(id);
    setMenuOpenId(null);
    try {
      await api.deleteDimensionEntry(contractId, dim.slug, id);
      onEntryDeleted(id);
    } finally { setDeletingId(null); }
  }

  const structured = data.structured as Record<string, string | string[]> | null;
  const formDef = DIMENSION_FORMS[dim.slug];
  const prose = structured ? buildProse(dim.slug, structured) : "";
  const canSaveText = body.trim().length > 0;
  const canSaveVoice = voiceStage === "recorded" && recordSeconds >= 10;

  return (
    <>
      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(0.12); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      <div style={{ paddingLeft: "108px", paddingTop: "40px" }}>
        <BackLink href="/contracts" label="Your contracts" marginBottom="30px" />

        {/* Banner card */}
        <div style={{
          background: LAVENDER_FILL, borderRadius: "20px",
          padding: "30px 60px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: "50px",
        }}>
          <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%", background: LAVENDER,
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: "24px", color: "white" }}>{initial}</span>
            </div>
            <div>
              <h1 style={{
                fontFamily: serif, fontStyle: "italic", fontWeight: 400,
                fontSize: "64px", color: BLACK, margin: "0 0 16px", lineHeight: 1.1,
              }}>
                {dim.label}
              </h1>
              {prose && (
                <p style={{
                  fontFamily: sans, fontStyle: "oblique", fontSize: "22px",
                  color: DARK_GREY, margin: 0, lineHeight: "1.6",
                  whiteSpace: "pre-line", maxWidth: "1180px",
                }}>
                  {prose}
                </p>
              )}
            </div>
          </div>
          {formDef && structured && Object.keys(structured).length > 0 && (
            <button onClick={onEditStructured} style={{
              fontFamily: sans, fontSize: "22px", color: LAVENDER,
              background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0,
            }}>
              edit
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", paddingLeft: "108px", paddingBottom: "80px", justifyContent: editing ? undefined : "space-between", alignItems: "flex-start", width: editing ? undefined : "1700px", gap: editing ? "60px" : undefined }}>

        {/* Left: ENTRIES list or inline EntryEditView */}
        <div style={{ flex: editing ? 1 : undefined, width: editing ? undefined : "800px", flexShrink: 0, display: "flex", flexDirection: "column", gap: editing ? "15px" : "50px" }}>
          {editing ? (
            <EntryEditView
              entry={editing}
              onSave={saveEdit}
              onTagsChange={tags => saveQuickTags(editing.id, tags)}
              onClose={() => { setEditing(null); setMode("voice"); }}
              saving={savingEdit}
              contractId={contractId}
              slug={dim.slug}
            />
          ) : (
            <>
              <p style={{
                fontFamily: sans, fontWeight: 700, fontSize: "22px",
                color: LAVENDER, margin: 0, letterSpacing: "0.03em",
              }}>ENTRIES</p>

              {data.entries.length === 0 ? (
                <p style={{ fontFamily: sans, fontStyle: "oblique", fontSize: "22px", color: DARK_GREY, margin: 0, lineHeight: "1.5" }}>
                  Your stories live here. Add your first entry.
                </p>
              ) : (
                data.entries.map(entry => {
                  const tags = entry.tags ?? {};
                  const peopleTags: string[] = tags.people?.length ? tags.people : [];
                  const yearTag = tags.year ?? null;
                  const placeTag = tags.place ?? null;
                  const allTags = [...peopleTags, ...(yearTag ? [yearTag] : []), ...(placeTag ? [placeTag] : [])];
                  const durationLabel = entry.entry_type === "voice" && entry.duration_s != null
                    ? `${Math.floor(entry.duration_s / 60)}:${String(entry.duration_s % 60).padStart(2, "0")}`
                    : null;
                  const meta = `${entry.entry_type === "voice" ? "Voice" : "Text"} • ${new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}${durationLabel ? ` • ${durationLabel}` : ""}`;
                  return (
                    <div key={entry.id} style={{
                      background: "white", border: `1px solid ${CREAM_STROKE}`, borderRadius: "15px",
                      padding: "30px 30px 20px", position: "relative",
                    }}>
                      <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "20px", color: BLACK, margin: "0 0 6px", paddingRight: "40px" }}>
                        {entry.title || (entry.body ? `${entry.body.slice(0, 80)}${entry.body.length > 80 ? "…" : ""}` : "Untitled entry")}
                      </p>
                      <p style={{ fontFamily: sans, fontSize: "16px", color: DARK_GREY, margin: "0 0 12px" }}>{meta}</p>
                      {entry.entry_type !== "voice" && entry.body && (
                        <p style={{ fontFamily: sans, fontSize: "16px", color: BLACK, margin: "0 0 12px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                          {entry.body.length > 240 ? entry.body.slice(0, 240) + "…" : entry.body}
                        </p>
                      )}
                      {entry.entry_type === "voice" && !entry.body ? (
                        <span style={{
                          fontFamily: sans, fontSize: "13px", padding: "5px 12px", borderRadius: "999px",
                          background: "#f0f0f0", color: LIGHT_GREY, fontStyle: "italic",
                        }}>transcribing…</span>
                      ) : allTags.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                          {allTags.map((c, i) => (
                            <span key={i} style={{
                              fontFamily: sans, fontSize: "14px", padding: "5px 12px", borderRadius: "999px",
                              background: LAVENDER_FILL, color: LAVENDER,
                            }}>{c}</span>
                          ))}
                        </div>
                      ) : null}
                      <div style={{ position: "absolute", top: "18px", right: "18px" }}>
                        <button onClick={() => setMenuOpenId(menuOpenId === entry.id ? null : entry.id)} style={{
                          fontFamily: sans, fontSize: "20px", color: DARK_GREY, letterSpacing: "1px",
                          background: "none", border: "none", cursor: "pointer", padding: "0 6px", lineHeight: 1,
                        }}>⋯</button>
                        {menuOpenId === entry.id && (
                          <div style={{
                            position: "absolute", top: "26px", right: 0, zIndex: 30, background: "white",
                            border: "1px solid #e6e0d6", borderRadius: "10px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "6px", minWidth: "130px",
                          }}>
                            <button onClick={() => { setEditing(entry); setMenuOpenId(null); }} style={menuItem()}>✎ edit</button>
                            <button onClick={() => deleteEntry(entry.id)} disabled={deletingId === entry.id} style={{ ...menuItem(), color: "#c0392b", opacity: deletingId === entry.id ? 0.5 : 1 }}>× delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Right: ADD entry (800px) — hidden while editing an existing entry;
            per Figma (2182:7663) the editor takes the full row, no second column */}
        {!editing && (
        <div style={{ width: "800px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "27px", height: "695px", alignItems: "flex-end" }}>
          {/* Label + card grouped tightly (~14px gap per Figma 2045:1116),
              distinct from the 27px gap between this block, the mode
              buttons row, and the Save button. */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontFamily: sans, fontWeight: 700, fontSize: "22px", color: LAVENDER, margin: 0, letterSpacing: "0.03em", alignSelf: "flex-start" }}>
            {mode === "text" ? "ADD TEXT ENTRY" : "ADD AN ENTRY"}
          </p>

          {/* Entry input card (433px tall) */}
          <div style={{
            background: "white", border: `1px solid ${CREAM_STROKE}`,
            borderRadius: "15px", height: "433px", width: "100%",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {mode === "text" ? (
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Start typing here…"
                style={{
                  flex: 1, padding: "24px 42px",
                  border: "none",
                  fontFamily: sans, fontSize: "22px", resize: "none",
                  background: "transparent", lineHeight: "1.6",
                  outline: "none", color: BLACK, boxSizing: "border-box",
                }}
              />
            ) : voiceStage === "recording" || voiceStage === "recorded" ? (
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "32px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "80px" }}>
                  {Array.from({ length: WAVE_BARS }).map((_, i) => (
                    <div key={i} style={{
                      width: "7px", height: "64px",
                      background: voiceStage === "recorded" ? LAVENDER_FILL : LAVENDER,
                      borderRadius: "4px", transformOrigin: "center",
                      animation: voiceStage === "recording"
                        ? `barPulse ${0.4 + (i % 5) * 0.08}s ease-in-out ${(i * 0.04).toFixed(2)}s infinite`
                        : "none",
                    }} />
                  ))}
                </div>
                <p style={{ fontFamily: sans, fontSize: "18px", color: LAVENDER, margin: 0, fontWeight: 700 }}>
                  {voiceStage === "recorded" && recordSeconds < 10
                    ? "Needs at least 10 seconds — record again"
                    : `${Math.floor(recordSeconds / 60)}:${String(recordSeconds % 60).padStart(2, "0")}`}
                </p>
              </div>
            ) : (
              <PromptCarousel
                questions={prompts.length > 0 ? prompts : ["Speak freely — there are no wrong answers."]}
                idx={promptIdx}
                onRotate={() => setPromptIdx(prev => (prev + 1) % (prompts.length || 1))}
              />
            )}
          </div>
          </div>

          {/* Mode buttons — justify-between, 253×71px each */}
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <button
              onClick={() => {
                if (mode !== "voice") { setMode("voice"); return; }
                if (voiceStage === "idle") startRecording();
                else if (voiceStage === "recording") stopRecording();
                // "recorded" stage: only Save is actionable, this button is disabled
              }}
              disabled={mode === "voice" && voiceStage === "recorded"}
              style={{
                width: "253px", height: "71px",
                background: mode === "voice" ? LAVENDER : "white",
                border: `1.5px solid ${mode === "voice" ? LAVENDER : CREAM_STROKE}`,
                borderRadius: "12px",
                cursor: mode === "voice" && voiceStage === "recorded" ? "not-allowed" : "pointer",
                opacity: mode === "voice" && voiceStage === "recorded" ? 0.5 : 1,
                fontFamily: sans, fontWeight: 700, fontSize: "18px",
                color: mode === "voice" ? "white" : LAVENDER,
              }}>
              {mode === "voice" && voiceStage === "recording" ? "■ Stop" : "♪ Voice"}
            </button>
            <button
              onClick={() => setMode("text")}
              disabled={mode === "voice" && voiceStage !== "idle"}
              style={{
                width: "253px", height: "71px",
                background: mode === "text" ? LAVENDER : "white",
                border: `1.5px solid ${mode === "text" ? LAVENDER : CREAM_STROKE}`,
                borderRadius: "12px",
                cursor: mode === "voice" && voiceStage !== "idle" ? "not-allowed" : "pointer",
                opacity: mode === "voice" && voiceStage !== "idle" ? 0.5 : 1,
                fontFamily: sans, fontWeight: 700, fontSize: "18px",
                color: mode === "text" ? "white" : LAVENDER,
              }}>
              ✎ Text
            </button>
            <button disabled style={{
              width: "253px", height: "71px",
              background: CREAM_FILL, border: `1.5px solid ${CREAM_STROKE}`,
              borderRadius: "12px", cursor: "not-allowed",
              fontFamily: sans, fontWeight: 700, fontSize: "18px", color: LIGHT_GREY,
            }}>
              ● Video (soon)
            </button>
          </div>

          {/* Save button — voice: dark purple + white text once stopped and
              ready to save (canSaveVoice), so it's visually clear a save is
              needed; light fill beforehand (idle/recording, not actionable). */}
          <button
            onClick={handleSave}
            disabled={saving || (mode === "text" ? !canSaveText : !canSaveVoice)}
            style={{
              width: "255px", height: "71px",
              background: mode === "text" ? LAVENDER : (canSaveVoice ? LAVENDER : LAVENDER_FILL),
              border: "none", borderRadius: "8px",
              fontFamily: sans, fontWeight: 700, fontSize: "18px",
              color: mode === "text" ? "white" : (canSaveVoice ? "white" : LAVENDER),
              cursor: saving || (mode === "text" ? !canSaveText : !canSaveVoice) ? "not-allowed" : "pointer",
              opacity: saving || (mode === "text" ? !canSaveText : !canSaveVoice) ? 0.5 : 1,
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
        )}
      </div>
    </>
  );
}

function menuItem(): CSSProperties {
  return {
    display: "block", width: "100%", textAlign: "left",
    fontFamily: sans, fontSize: "15px", color: BLACK,
    background: "none", border: "none", cursor: "pointer",
    padding: "8px 12px", borderRadius: "6px",
  };
}

export function DimensionClient() {
  const { contractId: rawId, dimension: rawDim } = useParams<{ contractId: string; dimension: string }>();
  const contractId = (() => {
    if (rawId !== "_") return rawId;
    if (typeof window === "undefined") return rawId;
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts[1] && parts[1] !== "_") return parts[1];
    return sessionStorage.getItem("ovyu_contract_id") ?? rawId;
  })();
  const dimension = rawDim === "_" && typeof window !== "undefined"
    ? (window.location.pathname.split("/").filter(Boolean)[2] ?? rawDim)
    : rawDim;
  const dim = DIMENSIONS.find(d => d.slug === dimension);
  const router = useRouter();

  const [data, setData] = useState<DimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [dimensionCounts, setDimensionCounts] = useState<Record<string, number>>({});

  const initial = typeof window !== "undefined"
    ? (sessionStorage.getItem("ovyu_maker_name") ?? "")[0]?.toUpperCase() ?? "?"
    : "?";
  const makerFirstName = typeof window !== "undefined"
    ? (sessionStorage.getItem("ovyu_maker_name") ?? "").split(" ")[0]
    : "";

  useEffect(() => {
    if (!dim) { router.replace(`/upload/${contractId}`); return; }
    Promise.all([
      api.getDimension(contractId, dimension),
      api.getHub(contractId),
    ]).then(([d, hub]) => {
      setData(d as DimData);
      if (DIMENSION_FORMS[dimension] && !d.structured) setShowForm(true);
      const hubCounts = (hub as { dimension_counts: Record<string, number> }).dimension_counts ?? {};
      setDimensionCounts({ ...hubCounts, [dimension]: (d as DimData).entries.length });
    }).catch(console.error).finally(() => setLoading(false));
  }, [contractId, dimension, dim, router]);

  const handleSaved = useCallback((structured: Record<string, unknown>) => {
    setData(prev => prev ? { ...prev, structured } : null);
    setShowForm(false);
  }, []);

  const handleEntryAdded = useCallback((e: Entry) => {
    setData(prev => {
      if (!prev) return null;
      const entries = [e, ...prev.entries];
      setDimensionCounts(c => ({ ...c, [dimension]: entries.length }));
      return { ...prev, entries };
    });
  }, [dimension]);
  const handleEntryDeleted = useCallback((id: string) => {
    setData(prev => {
      if (!prev) return null;
      const entries = prev.entries.filter(e => e.id !== id);
      setDimensionCounts(c => ({ ...c, [dimension]: entries.length }));
      return { ...prev, entries };
    });
  }, [dimension]);
  const handleEntryUpdated = useCallback((updated: Entry) => {
    setData(prev => prev ? { ...prev, entries: prev.entries.map(e => e.id === updated.id ? updated : e) } : null);
  }, []);

  if (!dim) return null;

  const formDef = DIMENSION_FORMS[dimension];

  return (
    <PageShell
      headerInitial={initial}
      contentStyle={{ paddingBottom: `${FOOTER_H + BAR_H}px` }}
      youBar={{ voiceComplete: true, contractId, dimensionCounts, activeDimension: dimension }}
    >
        {loading ? (
          <div style={{ paddingLeft: "108px", paddingTop: "60px" }}>
            <p style={{ fontFamily: sans, fontSize: "18px", color: DARK_GREY }}>Loading…</p>
          </div>
        ) : showForm && formDef ? (
          <DimensionForm
            contractId={contractId}
            dimension={dimension}
            dim={dim}
            formDef={formDef}
            initialStructured={data?.structured ?? null}
            makerFirstName={makerFirstName}
            onSaved={handleSaved}
          />
        ) : data ? (
          <EntriesView
            contractId={contractId}
            dim={dim}
            data={data}
            initial={initial}
            makerFirstName={makerFirstName}
            onEntryAdded={handleEntryAdded}
            onEntryDeleted={handleEntryDeleted}
            onEntryUpdated={handleEntryUpdated}
            onEditStructured={() => setShowForm(true)}
          />
        ) : (
          <div style={{ paddingLeft: "108px", paddingTop: "60px" }}>
            <p style={{ fontFamily: sans, fontSize: "18px", color: DARK_GREY }}>Could not load dimension.</p>
          </div>
        )}
    </PageShell>
  );
}
