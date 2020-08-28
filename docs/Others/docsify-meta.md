# Create Metadatas on Docsify

<span class="write-date">2020-08-28</span>

## CDN
``` html
<script src="https://cdn.jsdelivr.net/gh/tristan3716/docsify-meta/dist/docsify-meta.min.js"></script>
```

## Configuration
``` html
<script>
    window.$docsify = {
        meta: {
            author: 'Your name',
            aggressiveTitle: true,
            description: true,
            keyword: true,
        },
    }
</script>
```

|option|description|default|
|--|--|--|
|author|글을 작성한 사람(author)을 지정|false|
|aggressiveTitle|본문의 첫번째 '#' 태그를 제목으로 생성 및 title 변경|false|
|description|본문의 특수문자 제거후 첫 160글자를 설명으로 생성|true|
|keyword|본문중 패턴에 의해 선택된 문자열을 키워드로 생성 (구분자: `,`)|true|
|keywordPattern|keyword 선택 기준(String or RegExp)|`/keyword: *(.*)(?:\r\n)*$/g`|

keyword: meta, docsify
