const axios = require('axios');
const cheerio = require('cheerio');

/**
    code : 학교의 코드 //http://www.konkuk.ac.kr/do/MessageBoard/IpsiPop.do 확인 가능
    number: [유치원: 01,초등학교: 02,중학교: 03,고등학교: 04]
    school: [유치원: 1,초등학교: 2,중학교: 3,고등학교: 4]
    date: new Date() or new Date(~~~);
    @return void
  */
function getFoodInfo(code, number, school, date) {
  const getHtml = async() => {
    try {
      const dateStr = `${date.getFullYear()}.0${date.getMonth() +1}.${date.getDate() < 10 ? "0"+date.getDate() : date.getDate()}`;
      return await axios.get(`https://stu.sen.go.kr/sts_sci_md01_001.do?schulCode=${code}&schulCrseScCode=${number}&schulKndScCode=${school}&schMmealScCode=2&schYmd=${dateStr}`);
    }catch(error){
      console.log(error);
    }
  };

  getHtml().then((html) => {
    const $ = cheerio.load(html.data);
    const $body = $(".tbl_type3 tbody tr").children('.textC');
    const number = [8, 9, 10, 11, 12];
    const arr = [];
    const week = ['일', '월', '화', '수', '목', '금', '토'];
      $body.each((i, e) => {
        const str = $(e).text();
        if(!number.includes(i))return;
        arr.push(str);
      });
      console.log(week[date.getDay()]+'요일');
      console.log(getText(arr[date.getDay()]));
  });
}

function getText(str) {
  let bool = true;
  let st = str.replace(/[0-9]/g, "");
  for(let i =0; i < st.length; i++){
    if(st[i] == "."){
      if(bool){
        st = st.substr(0, i) + "\n" + st.substr(i+"\n".length);
        bool = false;
      }
    }else{
      bool = true;
    }
  }
  return st.replaceAll('.', '');
}

//예시사용 getFoodInfo('B100000662', 04, 4, new Date());
