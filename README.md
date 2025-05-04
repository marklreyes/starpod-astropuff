# Starpod

Starpod is the easiest way to create a podcast website in 5 minutes or less and
it is 100% free and open source.

### Configuration

You will need to configure your RSS feed and a few other pieces of info for your
podcast in starpod.config.mjs. We provide a util function `defineStarpodConfig`
that provides TypeScript types and enforces the correct formats for config
values.

An example config can be found [here](./starpod.config.ts).

#### Options

##### blurb

A very short tagline for your show. Generally, no more than one sentence. Less
is more here.

**Example:**

```ts
blurb: 'Your FAVORITE Cannabis Comedy Show!',
```

##### description

A somewhat longer description of what your show is about. This should still
ideally be fairly short, and should usually be 2-4 sentences.

**Example:**

```ts
description:
  'Hey, I’m Mark—those two are Darrell and Mike. We're three dads having real, often hilarious, cannabis-fueled chats about modern life. From vape pens that look like USBs to what our kids might think—we’re figuring it out as we go. We don’t have all the answers, but we’ve got questions, snacks, and a mic. So if you’re comfy with that, pull up a chair, kick back and welcome to The Puff Provisions Podcast!',
```

##### hosts

A list of your show's hosts and their info.

**Example:**

```ts
hosts: [
    {
      name: 'Mark',
      bio: 'Elevating minds and moods, one leafy convo at a time.',
      img: 'mark.jpg',
      instagram: 'https://www.instagram.com/puffprovisionsmark/',
      website: 'https://marklreyes.com'
    },
    {
      name: 'Darrell',
      bio: 'Out with the judgment, in with the good vibes.',
      img: 'darrell.jpg',
      instagram: 'https://www.instagram.com/puffprovisionsdarrell/',
    },
    {
      name: 'Mike',
      bio: 'Breaking stigma with laughs, facts, and just a little haze.',
      img: 'mike.jpg',
      instagram: 'https://www.instagram.com/puffprovisionsmike/',
    }
],
```

##### platforms

Links to the platforms your show is available on.

**Example:**

```ts
platforms: {
  apple: 'https://podcasts.apple.com/us/podcast/the-puff-provisions-podcast/id1462384838',
  spotify: 'https://open.spotify.com/show/2pymRIfDuaDCYRA2Znu8eQ?si=fabc9f336ac340aa',
  youtube: 'https://www.youtube.com/@puffprovisions/'
},
```

##### rssFeed

The url to the RSS feed where your podcast is hosted.

**Example:**

```ts
rssFeed: 'https://feeds.libsyn.com/176270/rss';
```

#### Setting up the contact form

The contact form hits an APIRoute at `/api/contact`. It is currently configured
to send the form data to a Slack channel webhook I had setup. It reads the url
from `import.meta.env.SLACK_WEBHOOK`, so if you define a `SLACK_WEBHOOK`
environment variable it should work for you. Of course, feel free to customize
the code [here](./src/pages/api/contact.ts) to send the data elsewhere as you
see fit.

#### Configuring guests

We use Turso and Astro DB to setup guests per episode. If you would also like to do this, you will need a Turso account.
