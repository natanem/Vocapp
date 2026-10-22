let voice: SpeechSynthesisVoice | undefined

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices()
  return voices.find((v) => v.lang === 'en-US' && /natural|google|samantha/i.test(v.name)) ?? voices.find((v) => v.lang === 'en-US')
}

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string) {
  if (!canSpeak) return
  voice ??= pickVoice()
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  if (voice) u.voice = voice
  u.rate = 0.95
  speechSynthesis.speak(u)
}
