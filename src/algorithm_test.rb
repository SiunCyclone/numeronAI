require 'pp'

$difficulty = 3
$range = (1..9)

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
  call = ($range).to_a.sample($difficulty)
  turn = 1

  callList = [call]
  judgeList = []
  candidateList = ($range).to_a.permutation($difficulty).to_a
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

  candidateCountHistory = []

  while (call != answer)
    turn += 1

    judgeResult = judge(call, answer)
    judgeList << judgeResult

    candidateList.select! do |candidate|
      if (judge(candidate, call) == judgeResult)
        true
      else
        outList << candidate
        false
      end
    end

    candidateCountHistory << candidateList.length

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

  p answer
  p callList
  p "Judge : #{ judgeList }"
  puts

  return [turn, candidateCountHistory]
end

def algo3_minimax(answer)
  call = ($range).to_a.sample($difficulty)
  turn = 1

  callList = [call]
  judgeList = []
  candidateList = ($range).to_a.permutation($difficulty).to_a
  outList = []

  predictNextCount = ->(target, judgeResult) {
    nextList = candidateList.select do |candidate|
      if (judge(target, candidate) == judgeResult)
        true
      else
        false
      end
    end

    nextCount = nextList.length

    if (nextCount == 0)
      nextCount = candidateList.length
    end

    return nextCount
  }

  calcExpectation = ->(target) {
    nextCountList = []

    candidateList.each do |candidate|
      judgeResult = judge(target, candidate)
      nextCountList << predictNextCount[target, judgeResult]
    end

    return nextCountList.inject(:+) / nextCountList.length.to_f
  }

  calcMinimax = ->(list) {
    expectationList = list.map{|target| calcExpectation[target] }

    expectationHash = {}
    expectationList.zip(list) do |ary|
      expectation = ary[0]
      candidate = ary[1]

      if (!expectationHash.key?(expectation))
        expectationHash[expectation] = candidate
      end
    end

    return expectationHash.min[1]
  }

  candidateCountHistory = []

  while (call != answer)
    turn += 1

    judgeResult = judge(call, answer)
    judgeList << judgeResult

    candidateList.select! do |candidate|
      if (judge(candidate, call) == judgeResult)
        true
      else
        outList << candidate
        false
      end
    end

    candidateCountHistory << candidateList.length

    call = calcMinimax[candidateList + outList]
    callList << call
  end

  p answer
  p callList
  p "Judge : #{ judgeList }"
  puts

  return [turn, candidateCountHistory]
end

def algo4_minimax_opt(answer)
  call = ($range).to_a.sample($difficulty)
  turn = 1

  candidateList = ($range).to_a.permutation($difficulty).to_a
  outList = []

  predictNextCount = ->(target, judgeResult) {
    nextList = candidateList.select do |candidate|
      if (judge(target, candidate) == judgeResult)
        true
      else
        false
      end
    end

    nextCount = nextList.length

    if (nextCount == 0)
      nextCount = candidateList.length
    end

    return nextCount
  }

  calcExpectation = ->(target) {
    nextCountList = []

    candidateList.each do |candidate|
      judgeResult = judge(target, candidate)
      nextCountList << predictNextCount[target, judgeResult]
    end

    return nextCountList.inject(:+) / nextCountList.length.to_f
  }

  calcMinimax = ->(list) {
    expectationList = list.map{|target| calcExpectation[target] }

    expectationHash = {}
    expectationList.zip(list) do |ary|
      expectation = ary[0]
      candidate = ary[1]

      if (!expectationHash.key?(expectation))
        expectationHash[expectation] = candidate
      end
    end

    return expectationHash.min[1]
  }

  candidateCountHistory = []

  while (call != answer)
    turn += 1

    judgeResult = judge(call, answer)
    candidateList.select! do |candidate|
      if (judge(candidate, call) == judgeResult)
        true
      else
        outList << candidate
        false
      end
    end

    candidateCountHistory << candidateList.length

    if (candidateList.length > 100)
      call = candidateList.sample(1).flatten
    else
      call = calcMinimax[candidateList + outList]
    end
  end

  return [turn, candidateCountHistory]
end

def showListInfo(list, name = nil)
  return if list == []

  turnList = list.map{|x| x[0] }.sort
  candidateCountHistory = list.map{|x| x[1] }

  turnInfo = {}

  turnList.each do |turn|
    if (turnInfo.key?(turn))
      turnInfo[turn] += 1
    else
      turnInfo[turn] = 1
    end
  end

  maxLength = candidateCountHistory.map{|x| x.length}.max

  candidateCountHistory = candidateCountHistory.map{|x|
    result = x
    (maxLength - x.length).times do |i|
      result << 0
    end

    result
  }

  lastIndex = candidateCountHistory.length - 1

  tmp = candidateCountHistory[0].zip(*candidateCountHistory[1..lastIndex])
  meanList = tmp.map{|x| (x.inject(:+) / x.select{|x| x != 0 }.length.to_f).round(2) }

  puts
  p name if (name != nil)

  turnInfo.to_a.each_with_index do |info, i|
    turn = info[0]
    count = info[1]

    p " |Turn: " + turn.to_s +
      " |Count: " + count.to_s +
      " |Probability: " + (count / turnList.length.to_f * 100.0).round(1).to_s + "%" +
      " |CandidateCount: " + meanList[i].to_s + " |"
  end

  p "Average: " + (list.map{|x| x[0]}.inject(:+).to_f / list.length).to_s + " turn"
end

def main
  list1 = []
  list2 = []
  list3 = []
  list4 = []

  trial = 10
  trial.times do |i|
    p "#{ i.to_s }/#{ trial } (#{ (i / trial.to_f * 100.0).round(1) }%)"

    answer = ($range).to_a.sample($difficulty)

    # list1 << algo1_random(answer)
    #list2 << algo2_entropy(answer)
    list3 << algo3_minimax(answer)
    #list4 << algo4_minimax_opt(answer)
  end

  #showListInfo(list2, "Entropy")
  showListInfo(list3, "Minimax")
  #showListInfo(list4, "MinimaxOpt")
end

main

