require 'pp'

$difficulty = 3

def judge(call, answer)
  eat = 0
  bite = 0

  call.zip(answer) do |ary|
    if (ary[0] == ary[1])
      eat += 1
    elsif (answer.include?(ary[0]))
      bite += 1
    end
  end

  return [eat, bite]
end

def createCandidate(originalNumbers)
  candidateList = []

  loopLamb = ->(candidateTmp = [], numbers) {
    numbers.each do |x|
      candidate = [*candidateTmp, x]

      if (candidate.length == $difficulty)
        candidateList << candidate
      else
        restNumbers = numbers.select{|y| y != x }
        loopLamb[candidate, restNumbers]
      end
    end
  }

  loopLamb.call(originalNumbers)

  return candidateList
end

def updateCandidate(call, judgeResult, candidateList)
end

def algo1_random(answer)
  call = nil
  turn = 0

  while (call != answer)
    turn += 1
    call = (1..9).to_a.sample($difficulty)
  end

  return turn
end

def algo2_entropy(answer)
  call = (1..9).to_a.sample($difficulty)
  turn = 1

  candidateList = createCandidate((1..9).to_a)
  outList = []

  total = candidateList.length

  calcEntropy = ->(target, list) {
    judgeHash = {}

    list.each do |candidate|
      result = judge(target, candidate)

      if (judgeHash.key?(result))
        judgeHash[result] += 1
      else
        judgeHash[result] = 1
      end
    end

    countList = judgeHash.values
    probabilityList = countList.map{|count| count / total.to_f }
    entropy = probabilityList.map{|p| p * -Math.log(p, 2) }.inject(:+)

    return entropy
  }

  callList = [call]
  while (call != answer)
    turn += 1

    judgeResult = judge(call, answer)
    outList = candidateList.select{|candidate| judge(candidate, call) != judgeResult }
    candidateList.select!{|candidate| judge(candidate, call) == judgeResult }

    entropyHash = {}
    (candidateList + outList).each do |target|
      entropy = calcEntropy[target, candidateList]

      if (!entropyHash.key?(entropy))
        entropyHash[entropy] = target
      end
    end

    call = entropyHash[entropyHash.keys.max]
    callList << call
  end

  p "answer: " + answer.to_s
  p callList

  return turn
end

def main
  tlist1 = []
  tlist2 = []

  20.times do |x|
    answer = (1..9).to_a.sample($difficulty)

    # tlist1 << algo1_random(answer)
    tlist2 << algo2_entropy(answer)
  end

  p tlist2
  p tlist2.inject(:+).to_f / tlist2.length
end

main

